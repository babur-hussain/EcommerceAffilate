type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const store = new Map<string, CacheEntry<unknown>>();

export const RANKING_CACHE_PREFIX = 'ranking:';

export function getCache<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;

  const now = Date.now();
  if (entry.expiresAt <= now) {
    store.delete(key);
    return undefined;
  }

  return entry.value as T;
}

export function setCache<T>(key: string, value: T, ttlSeconds: number): void {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  store.set(key, { value, expiresAt });
}

export function delCache(key: string): void {
  store.delete(key);
}

export function clearCacheByPrefix(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}
