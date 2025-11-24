/**
 * Request deduplication - prevents duplicate API calls
 * Useful for concurrent requests to the same endpoint
 */

interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
}

class RequestDeduplicator {
  private static requests = new Map<string, PendingRequest>();
  private static readonly TIMEOUT = 5 * 60 * 1000; // 5 minutes

  /**
   * Execute a request with automatic deduplication
   * If an identical request is already in flight, reuse its promise
   */
  static async dedupFetch<T>(
    url: string,
    options?: RequestInit,
    cacheKey?: string
  ): Promise<T> {
    const key = cacheKey || `${options?.method || 'GET'}:${url}`;
    const existing = this.requests.get(key);

    if (existing) {
      return existing.promise;
    }

    const promise = fetch(url, options).then(r => {
      if (!r.ok) throw new Error(`${r.status}: ${r.statusText}`);
      return r.json() as Promise<T>;
    });

    this.requests.set(key, { promise, timestamp: Date.now() });

    // Cleanup after timeout
    setTimeout(() => {
      this.requests.delete(key);
    }, this.TIMEOUT);

    return promise;
  }

  static clear(): void {
    this.requests.clear();
  }
}

export default RequestDeduplicator;
