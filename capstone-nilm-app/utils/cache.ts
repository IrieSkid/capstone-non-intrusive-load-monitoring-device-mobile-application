/**
 * Simple Cache Utility
 * Reduces Firebase reads by caching recent query results
 * 
 * ⚠️ DEPLOYMENT NOTE:
 * This can stay enabled in production as it improves performance.
 * Adjust CACHE_DURATION in environment.ts based on real-time needs.
 */

import { ENV } from '@/config/environment';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class Cache {
  private store: Map<string, CacheEntry<any>> = new Map();

  /**
   * Get cached data if valid
   */
  get<T>(key: string): T | null {
    if (!ENV.ENABLE_CACHING) {
      return null;
    }

    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    const age = Date.now() - entry.timestamp;
    if (age > ENV.CACHE_DURATION) {
      // Cache expired
      this.store.delete(key);
      return null;
    }

    console.log(`💾 Cache HIT: ${key} (age: ${Math.round(age / 1000)}s)`);
    return entry.data;
  }

  /**
   * Store data in cache
   */
  set<T>(key: string, data: T): void {
    if (!ENV.ENABLE_CACHING) {
      return;
    }

    this.store.set(key, {
      data,
      timestamp: Date.now(),
    });
    console.log(`💾 Cache SET: ${key}`);
  }

  /**
   * Invalidate specific cache entry
   */
  invalidate(key: string): void {
    this.store.delete(key);
    console.log(`💾 Cache INVALIDATE: ${key}`);
  }

  /**
   * Invalidate all cache entries matching a pattern
   */
  invalidatePattern(pattern: string): void {
    const keys = Array.from(this.store.keys());
    const matched = keys.filter(key => key.includes(pattern));
    
    matched.forEach(key => {
      this.store.delete(key);
    });

    console.log(`💾 Cache INVALIDATE PATTERN: ${pattern} (${matched.length} entries)`);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    const size = this.store.size;
    this.store.clear();
    console.log(`💾 Cache CLEAR: ${size} entries removed`);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.store.size,
      entries: Array.from(this.store.keys()),
    };
  }
}

export const cache = new Cache();

/**
 * Generate cache key from parameters
 */
export const generateCacheKey = (...parts: any[]): string => {
  return parts.map(p => String(p)).join(':');
};

/**
 * Cache decorator for async functions
 */
export function cached(keyGenerator: (...args: any[]) => string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyGenerator(...args);
      
      // Try to get from cache
      const cachedData = cache.get(cacheKey);
      if (cachedData !== null) {
        return cachedData;
      }

      // Execute original method
      const result = await originalMethod.apply(this, args);
      
      // Store in cache
      cache.set(cacheKey, result);
      
      return result;
    };

    return descriptor;
  };
}
