import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { RATE_LIMIT, RATE_LIMIT_TIME, TRUSTED_RATE_LIMITLESS_IPS } from "../constants/variables/constants";

interface RateLimitRequest extends Request {
  rateLimit?: {
    resetTime: number;
    limit: number;
    current: number;
  };
}

interface RateLimitErrorResponse {
  error: string;
  retryAfter: string;
  limit: number;
  current: number;
}

/**
 * A reusable rate-limiting middleware.
 * @param windowMs Time window for rate limit (in milliseconds).
 * @param limit Maximum number of requests allowed within the time window.
 * @param trustedIPs List of IPs that bypass rate limiting.
 * @returns Express middleware for rate limiting.
 */
const createRateLimiter = (windowMs = 15 * 60 * 1000, limit = 100, trustedIPs: string[] = []) => {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,

    // Custom error handler for rate limit exceeded
    handler: (req: RateLimitRequest, res: Response, next: NextFunction) => {
      if (!req.rateLimit) {
        return res.status(500).json({ error: "Rate limit information not available" });
      }

      const resetTimeInMs = req.rateLimit.resetTime * (req.rateLimit.resetTime < 1e10 ? 1000 : 1);

      const response: RateLimitErrorResponse = {
        error: "Too many requests, please try again later",
        retryAfter: new Date(resetTimeInMs).toLocaleString(),
        limit: req.rateLimit.limit,
        current: req.rateLimit.current,
      };

      res.status(429).json(response);
    },

    // Skip rate limiting for trusted IPs
    skip: (req: RateLimitRequest): boolean => {
      return trustedIPs.includes(req.ip || "");
    },

    // Custom key generator combining IP and API key
    keyGenerator: (req: RateLimitRequest): string => {
      const apiKey = req.headers["x-api-key"] || "";
      return `${req.ip || ""}-${apiKey}`;
    },
  });
};

const RateLimiterMiddleware = createRateLimiter(RATE_LIMIT_TIME, RATE_LIMIT, TRUSTED_RATE_LIMITLESS_IPS); 
export default RateLimiterMiddleware;