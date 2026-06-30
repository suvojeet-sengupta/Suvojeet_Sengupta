/**
 * Client-side API base URL.
 *
 * The backend now runs as a standalone service on a VPS. Set
 * NEXT_PUBLIC_API_BASE_URL to its public URL (e.g.
 * "https://api.suvojeetsengupta.in") so the browser calls the VPS backend
 * instead of the same-origin Cloudflare routes.
 *
 * If the variable is unset, it falls back to same-origin ("") — i.e. the old
 * behaviour — so nothing breaks in local dev or during migration.
 */
export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

/** Prefix an API path (e.g. "/api/public/posts") with the configured base. */
export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
