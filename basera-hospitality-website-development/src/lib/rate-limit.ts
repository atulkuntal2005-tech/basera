/**
 * Tiny in-memory rate limiter (per server instance). Good enough to blunt
 * basic form spam. For multi-instance deployments swap in Redis/Upstash.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim();
}
