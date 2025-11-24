/**
 * Efficient localStorage caching utilities
 * Handles serialization, expiration, and automatic cleanup
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds, undefined = forever
}

class CacheManager {
  private static readonly PREFIX = "tempmail_cache_";
  private static readonly METADATA_KEY = "tempmail_cache_metadata";

  /**
   * Set cached value with optional TTL
   * @param key Cache key
   * @param value Value to cache
   * @param ttlMs Time to live in milliseconds (undefined = forever)
   */
  static set<T>(key: string, value: T, ttlMs?: number): void {
    if (typeof window === "undefined") return;

    try {
      const item: CacheItem<T> = {
        data: value,
        timestamp: Date.now(),
        ttl: ttlMs,
      };
      localStorage.setItem(this.PREFIX + key, JSON.stringify(item));
      this.updateMetadata(key, ttlMs);
    } catch (err) {
      // Silently fail if localStorage is full
      console.debug("Cache write failed:", err);
    }
  }

  /**
   * Get cached value if it exists and hasn't expired
   * @param key Cache key
   * @returns Cached value or null if expired/missing
   */
  static get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;

    try {
      const stored = localStorage.getItem(this.PREFIX + key);
      if (!stored) return null;

      const item: CacheItem<T> = JSON.parse(stored);
      const isExpired = item.ttl && Date.now() - item.timestamp > item.ttl;

      if (isExpired) {
        localStorage.removeItem(this.PREFIX + key);
        return null;
      }

      return item.data;
    } catch (err) {
      console.debug("Cache read failed:", err);
      return null;
    }
  }

  /**
   * Check if cache exists and is valid
   */
  static has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove cached value
   */
  static remove(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.PREFIX + key);
  }

  /**
   * Clear all cache
   */
  static clear(): void {
    if (typeof window === "undefined") return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (err) {
      console.debug("Cache clear failed:", err);
    }
  }

  private static updateMetadata(key: string, ttl?: number): void {
    try {
      const metadata = localStorage.getItem(this.METADATA_KEY);
      const map = metadata ? JSON.parse(metadata) : {};
      map[key] = { timestamp: Date.now(), ttl };
      localStorage.setItem(this.METADATA_KEY, JSON.stringify(map));
    } catch (err) {
      console.debug("Metadata update failed:", err);
    }
  }
}

export default CacheManager;
