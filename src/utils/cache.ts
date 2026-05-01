/**
 * PERFORMANCE OPTIMIZATION:
 * A simple in-memory cache for AI responses.
 * 
 * LATENCY IMPACT: 
 * - Cache Miss (Gemini API): ~1.2s - 2.5s
 * - Cache Hit (In-Memory): <10ms
 */
class ResponseCache {
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly TTL = 1000 * 60 * 10; // 10 minutes

  constructor() {
    this.cache = new Map();
  }

  private generateKey(message: string, context: any, language: string): string {
    return `${language}:${message}:${JSON.stringify(context)}`;
  }

  get(message: string, context: any, language: string): any | null {
    const key = this.generateKey(message, context, language);
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(message: string, context: any, language: string, data: any): void {
    const key = this.generateKey(message, context, language);
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const responseCache = new ResponseCache();
