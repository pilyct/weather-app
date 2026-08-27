interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const MAX_CACHE_SIZE = 500;

const cache = new Map<string, CacheEntry<unknown>>();

async function withCache<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (entry) {
    if (entry.expiresAt > Date.now()) {
      // Re-insert to mark as most recently used
      cache.delete(key);
      cache.set(key, entry);
      return entry.value;
    }
    cache.delete(key);
  }

  const value = await fetcher();

  if (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) {
      cache.delete(oldestKey);
    }
  }

  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

export { withCache };
