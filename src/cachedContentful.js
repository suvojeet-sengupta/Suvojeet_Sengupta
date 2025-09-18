import client from './contentful';

const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export async function getCachedEntries(query) {
  const cacheKey = `contentful_${JSON.stringify(query)}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  const response = await client.getEntries(query);
  localStorage.setItem(cacheKey, JSON.stringify({ data: response, timestamp: Date.now() }));
  return response;
}
