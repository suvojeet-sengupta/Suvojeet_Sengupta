import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getKv, getRuntimeString, requireRuntimeString } from '@/lib/cloudflare';
import { sha256Hex } from '@/lib/blog-utils';
import { SignJWT, jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'admin_session';
const REFRESH_TOKEN_COOKIE_NAME = 'admin_refresh_token';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const MAX_PBKDF2_ITERATIONS = 100000;
const DEFAULT_HASH_ITERATIONS = MAX_PBKDF2_ITERATIONS;
const DEFAULT_SESSION_HOURS = 168; // 7 days
const DEFAULT_ADMIN_EMAIL = 'suvojeet@suvojeetsengupta.in';
const encoder = new TextEncoder();

export interface AdminUser {
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: string;
}

export interface JWTPayload {
  email: string;
  type?: 'refresh' | 'access';
  [key: string]: unknown;
}

function isProductionRuntime(): boolean {
  if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
    return process.env.NODE_ENV === 'production';
  }

  return false;
}

async function getJwtSecretKey(): Promise<Uint8Array> {
  const secret = requireRuntimeString('JWT_SECRET');
  return encoder.encode(secret);
}

export async function createAccessToken(email: string): Promise<string> {
  const secret = await getJwtSecretKey();
  return await new SignJWT({ email, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(secret);
}

export async function createRefreshToken(email: string): Promise<string> {
  const secret = await getJwtSecretKey();
  const token = await new SignJWT({ email, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TOKEN_EXPIRY_DAYS}d`)
    .sign(secret);

  // Store refresh token hash in KV for revocation support
  const tokenHash = await sha256Hex(token);
  const kv = getKv();
  const ttl = REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60;
  await kv.put(`refresh_token:${tokenHash}`, email.trim().toLowerCase(), { expirationTtl: ttl });

  return token;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = await getJwtSecretKey();
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  const payload = await verifyToken(token);
  if (!payload || payload.type !== 'refresh') return null;

  // Check if refresh token is revoked
  const tokenHash = await sha256Hex(token);
  const kv = getKv();
  const emailInKv = await kv.get(`refresh_token:${tokenHash}`);
  
  if (!emailInKv || emailInKv !== payload.email) {
    return null;
  }

  return payload;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function parsePasswordHash(storedHash: string) {
  const [algorithm, rawIterations, salt, hash] = storedHash.split('$');
  if (algorithm !== 'pbkdf2_sha256') {
    throw new Error('Unsupported ADMIN_PASSWORD_HASH algorithm.');
  }

  const iterations = Number(rawIterations);
  if (!Number.isFinite(iterations) || iterations <= 0) {
    throw new Error('Invalid ADMIN_PASSWORD_HASH iteration count.');
  }
  if (iterations > MAX_PBKDF2_ITERATIONS) {
    throw new Error(
      `ADMIN_PASSWORD_HASH uses ${iterations} PBKDF2 iterations, but Cloudflare runtime supports up to ${MAX_PBKDF2_ITERATIONS}. Regenerate hash with npm run hash:admin-password.`,
    );
  }

  return {
    iterations,
    salt: base64ToBytes(salt),
    hash: base64ToBytes(hash),
  };
}

async function derivePasswordHash(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  const saltBytes = new Uint8Array(salt.byteLength);
  saltBytes.set(salt);

  const importedKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: saltBytes,
      iterations,
    },
    importedKey,
    256,
  );

  return new Uint8Array(derivedBits);
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left[index] ^ right[index];
  }

  return mismatch === 0;
}

function parseCookieValue(cookieHeader: string | null, cookieName: string): string | null {
  if (!cookieHeader) {
    return null;
  }

  const cookiesList = cookieHeader.split(';');
  for (const cookieEntry of cookiesList) {
    const [rawName, ...rawValueParts] = cookieEntry.trim().split('=');
    if (rawName === cookieName) {
      return rawValueParts.join('=');
    }
  }

  return null;
}

function getSessionMaxAgeSeconds(): number {
  const configured = Number(getRuntimeString('SESSION_TTL_HOURS') || DEFAULT_SESSION_HOURS);
  if (!Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_SESSION_HOURS * 60 * 60;
  }

  return Math.floor(configured * 60 * 60);
}

export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const expectedEmail = (getRuntimeString('ADMIN_EMAIL') || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
  return email.trim().toLowerCase() === expectedEmail;
}

export async function generatePasswordHash(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePasswordHash(password, salt, DEFAULT_HASH_ITERATIONS);
  return `pbkdf2_sha256$${DEFAULT_HASH_ITERATIONS}$${bytesToBase64(salt)}$${bytesToBase64(hash)}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parsed = parsePasswordHash(storedHash);
  const actualHash = await derivePasswordHash(password, parsed.salt, parsed.iterations);
  return timingSafeEqual(actualHash, parsed.hash);
}

export async function validateAdminCredentials(email: string, password: string): Promise<boolean> {
  const kv = getKv();
  const normalizedEmail = email.trim().toLowerCase();
  
  // Try to find user in KV
  const userJson = await kv.get(`user:${normalizedEmail}`);
  if (userJson) {
    const user = JSON.parse(userJson) as AdminUser;
    return verifyPassword(password, user.passwordHash);
  }

  // Fallback to environment variables for the initial admin
  if (isSuperAdmin(normalizedEmail)) {
    const expectedPasswordHash = getRuntimeString('ADMIN_PASSWORD_HASH')?.trim();
    if (expectedPasswordHash) {
      return verifyPassword(password, expectedPasswordHash);
    }
  }

  return false;
}

export async function createOrUpdateUser(user: AdminUser): Promise<void> {
  const kv = getKv();
  const normalizedEmail = user.email.trim().toLowerCase();
  await kv.put(`user:${normalizedEmail}`, JSON.stringify({
    ...user,
    email: normalizedEmail,
    createdAt: user.createdAt || new Date().toISOString()
  }));
}

/**
 * @deprecated Use createAccessToken and createRefreshToken for stateless auth
 */
export async function createAdminSessionToken(email: string): Promise<string> {
  const token = `${crypto.randomUUID()}${crypto.randomUUID()}`;
  const tokenHash = await sha256Hex(token);
  const ttl = getSessionMaxAgeSeconds();
  
  const kv = getKv();
  await kv.put(`session:${tokenHash}`, email.trim().toLowerCase(), { expirationTtl: ttl });

  return token;
}

export async function revokeAdminSession(token: string): Promise<void> {
  // Revoke classic session
  const tokenHash = await sha256Hex(token);
  const kv = getKv();
  await kv.delete(`session:${tokenHash}`);
  
  // Revoke refresh token if it is one
  const payload = await verifyToken(token);
  if (payload && payload.type === 'refresh') {
    await kv.delete(`refresh_token:${tokenHash}`);
  }
}

export function getAdminTokenFromRequest(request: Request): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Fallback to cookie
  return parseCookieValue(request.headers.get('cookie'), SESSION_COOKIE_NAME);
}

export async function getAuthenticatedUserEmail(token: string | null): Promise<string | null> {
  if (!token) return null;

  // Try JWT verification first
  const payload = await verifyToken(token);
  if (payload && payload.email) {
    return payload.email;
  }

  // Fallback to classic session check
  const tokenHash = await sha256Hex(token);
  const kv = getKv();
  return await kv.get(`session:${tokenHash}`);
}

export async function isAdminSessionValid(token: string | null): Promise<boolean> {
  const email = await getAuthenticatedUserEmail(token);
  return email !== null;
}

export async function isAdminRequestAuthenticated(request: Request): Promise<boolean> {
  const token = getAdminTokenFromRequest(request);
  return isAdminSessionValid(token);
}

export async function isSuperAdminRequest(request: Request): Promise<boolean> {
  const token = getAdminTokenFromRequest(request);
  const email = await getAuthenticatedUserEmail(token);
  return isSuperAdmin(email);
}

export function attachAdminCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProductionRuntime(),
    sameSite: 'lax',
    path: '/',
    maxAge: getSessionMaxAgeSeconds(),
  });
  return response;
}

export function attachRefreshTokenCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set({
    name: REFRESH_TOKEN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProductionRuntime(),
    sameSite: 'strict',
    path: '/',
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60,
  });
  return response;
}

export function clearAdminCookies(response: NextResponse): NextResponse {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: isProductionRuntime(),
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  response.cookies.set({
    name: REFRESH_TOKEN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: isProductionRuntime(),
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}

/**
 * @deprecated Use clearAdminCookies
 */
export function clearAdminCookie(response: NextResponse): NextResponse {
  return clearAdminCookies(response);
}

export async function isDashboardSessionActive(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
  return isAdminSessionValid(token);
}

export function adminCookieName(): string {
  return SESSION_COOKIE_NAME;
}

export function refreshCookieName(): string {
  return REFRESH_TOKEN_COOKIE_NAME;
}
