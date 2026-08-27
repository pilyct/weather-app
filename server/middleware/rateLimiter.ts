import type { Request, Response, NextFunction } from "express";

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

interface WindowEntry {
  count: number;
  windowStart: number;
}

const requestCounts = new Map<string, WindowEntry>();

function getClientIp(req: Request): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.ip || "unknown";
}

function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = getClientIp(req);
  const now = Date.now();

  let entry = requestCounts.get(ip);
  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    entry = { count: 0, windowStart: now };
    requestCounts.set(ip, entry);
  }

  entry.count += 1;

  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - entry.count);
  const resetSeconds = Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000);

  res.set("X-RateLimit-Limit", String(MAX_REQUESTS_PER_WINDOW));
  res.set("X-RateLimit-Remaining", String(remaining));
  res.set("X-RateLimit-Reset", String(resetSeconds));

  if (entry.count > MAX_REQUESTS_PER_WINDOW) {
    res.status(429).json({ error: "Too many requests, please try again later" });
    return;
  }

  next();
}

export { rateLimiter };
