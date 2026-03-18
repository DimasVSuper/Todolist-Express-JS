import rateLimit from "express-rate-limit";

const parseEnvInt = (key, fallback) => {
  const value = Number(process.env[key]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export const apiRateLimiter = rateLimit({
  windowMs: parseEnvInt("RATE_LIMIT_WINDOW_MS", DEFAULT_WINDOW_MS),
  max: parseEnvInt("RATE_LIMIT_MAX", 100),
  standardHeaders: true,
  legacyHeaders: false,
});

export const createRouteRateLimiter = ({ windowMs, max }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
  });

export const createRouteRateLimiterFromEnv = (prefix, defaults) => {
  const windowMs = parseEnvInt(`${prefix}_WINDOW_MS`, defaults.windowMs);
  const max = parseEnvInt(`${prefix}_MAX`, defaults.max);
  return createRouteRateLimiter({ windowMs, max });
};
