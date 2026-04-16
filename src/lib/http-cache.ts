export const PUBLIC_READ_CACHE_CONTROL = 'public, max-age=0, s-maxage=120, stale-while-revalidate=600';
export const NO_STORE_CACHE_CONTROL = 'no-store, max-age=0';

export const PUBLIC_READ_HEADERS: Record<string, string> = {
  'Cache-Control': PUBLIC_READ_CACHE_CONTROL,
};

export const NO_STORE_HEADERS: Record<string, string> = {
  'Cache-Control': NO_STORE_CACHE_CONTROL,
};
