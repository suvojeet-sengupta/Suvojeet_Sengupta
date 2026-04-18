type D1Value = string | number | null;

export interface D1PreparedStatement {
  bind(...values: D1Value[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(columnName?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run<T = unknown>(): Promise<{ success: boolean; results?: T[]; meta?: Record<string, unknown> }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(
    statements: D1PreparedStatement[],
  ): Promise<Array<{ success: boolean; results?: T[]; meta?: Record<string, unknown> }>>;
}

export interface KVNamespace {
  get(key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream'; cacheTtl?: number }): Promise<any>;
  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: { expiration?: number; expirationTtl?: number; metadata?: any }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: { name: string; expiration?: number; metadata?: any }[]; list_complete: boolean; cursor?: string }>;
}

interface CloudflareEnv {
  DB?: D1Database;
  KV?: KVNamespace;
  [key: string]: unknown;
}

const REQUEST_CONTEXT_SYMBOLS = [
  Symbol.for('__cloudflare-request-context__'),
  Symbol.for('__cloudflare-request-context'),
  Symbol.for('__cloudflare-context__'),
];

function asRecord(value: unknown): Record<string | symbol, unknown> | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  return value as Record<string | symbol, unknown>;
}

function getEnvFromRequestContext(): CloudflareEnv | null {
  const globalStore = globalThis as unknown as Record<string | symbol, unknown>;

  for (const symbolKey of REQUEST_CONTEXT_SYMBOLS) {
    const context = asRecord(globalStore[symbolKey]);
    const env = context ? asRecord(context.env) : null;
    if (env) {
      return env as CloudflareEnv;
    }
  }

  const directContext = asRecord(globalStore.__cloudflareRequestContext);
  const directEnv = directContext ? asRecord(directContext.env) : null;
  if (directEnv) {
    return directEnv as CloudflareEnv;
  }

  const openNextContext = asRecord(globalStore.__cloudflareContext);
  const openNextEnv = openNextContext ? asRecord(openNextContext.env) : null;
  if (openNextEnv) {
    return openNextEnv as CloudflareEnv;
  }

  return null;
}

function isD1Database(value: unknown): value is D1Database {
  return (
    typeof value === 'object'
    && value !== null
    && typeof (value as D1Database).prepare === 'function'
  );
}

export function getCloudflareEnv(): CloudflareEnv {
  const envFromContext = getEnvFromRequestContext();
  if (envFromContext) {
    return envFromContext;
  }

  const globalStore = globalThis as unknown as Record<string | symbol, unknown>;
  const globalEnv = asRecord(globalStore.__env__);
  if (globalEnv) {
    return globalEnv as CloudflareEnv;
  }

  if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
    return process.env as unknown as CloudflareEnv;
  }

  return {};
}

export function getDb(): D1Database {
  const env = getCloudflareEnv();
  const directDb = env.DB;
  if (isD1Database(directDb)) {
    return directDb;
  }

  const globalStore = globalThis as unknown as Record<string | symbol, unknown>;
  const fallbackDb = globalStore.DB;
  if (isD1Database(fallbackDb)) {
    return fallbackDb;
  }

  throw new Error('D1 binding "DB" not found. Bind your database with binding name DB in Cloudflare Pages.');
}

export function getKv(): KVNamespace {
  const env = getCloudflareEnv();
  const directKv = env.KV;
  if (directKv && typeof (directKv as KVNamespace).put === 'function') {
    return directKv as KVNamespace;
  }

  const globalStore = globalThis as unknown as Record<string | symbol, unknown>;
  const fallbackKv = globalStore.KV;
  if (fallbackKv && typeof (fallbackKv as KVNamespace).put === 'function') {
    return fallbackKv as KVNamespace;
  }

  throw new Error('KV binding "KV" not found. Bind your KV namespace with binding name KV in Cloudflare Pages.');
}

export function getRuntimeString(name: string): string | undefined {
  if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
    const processValue = process.env[name];
    if (typeof processValue === 'string' && processValue.trim().length > 0) {
      return processValue;
    }
  }

  const env = getCloudflareEnv();
  const exactRuntimeValue = env[name];
  if (typeof exactRuntimeValue === 'string' && exactRuntimeValue.trim().length > 0) {
    return exactRuntimeValue;
  }

  const mapLikeEnv = env as unknown as { get?: (key: string) => unknown };
  const mapLikeValue = typeof mapLikeEnv.get === 'function' ? mapLikeEnv.get(name) : undefined;
  if (typeof mapLikeValue === 'string' && mapLikeValue.trim().length > 0) {
    return mapLikeValue;
  }

  const envEntries = Object.entries(env);
  const caseInsensitiveMatch = envEntries.find(([key]) => key.toUpperCase() === name.toUpperCase());
  if (caseInsensitiveMatch && typeof caseInsensitiveMatch[1] === 'string' && caseInsensitiveMatch[1].trim().length > 0) {
    return caseInsensitiveMatch[1];
  }

  return undefined;
}

export function requireRuntimeString(name: string): string {
  const value = getRuntimeString(name);
  if (!value) {
    throw new Error(`Missing runtime configuration: ${name}`);
  }

  return value;
}
