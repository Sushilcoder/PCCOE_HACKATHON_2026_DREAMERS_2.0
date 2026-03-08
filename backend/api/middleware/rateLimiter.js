const redis = require('redis');

// Rate limiting middleware
const createRateLimiter = (redisClient, windowMs = 60000, maxRequests = 100) => {
  return async (req, res, next) => {
    try {
      const key = `rate-limit:${req.ip || req.socket.remoteAddress}`;
      const current = await redisClient.incr(key);

      if (current === 1) {
        await redisClient.expire(key, Math.ceil(windowMs / 1000));
      }

      res.set('X-RateLimit-Limit', maxRequests);
      res.set('X-RateLimit-Remaining', Math.max(0, maxRequests - current));

      if (current > maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later'
        });
      }

      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      next();
    }
  };
};

// Analysis-specific rate limiter (stricter for ML operations)
const analysisRateLimiter = (redisClient) => {
  return createRateLimiter(redisClient, 60000, 10); // 10 requests per minute
};

// Auth rate limiter (strict for login attempts)
const authRateLimiter = (redisClient) => {
  return async (req, res, next) => {
    try {
      const key = `auth-attempt:${req.body.email || req.ip}`;
      const attempts = await redisClient.incr(key);

      if (attempts === 1) {
        await redisClient.expire(key, 900); // 15 minutes
      }

      if (attempts > 5) {
        return res.status(429).json({
          success: false,
          message: 'Too many login attempts, please try again later'
        });
      }

      next();
    } catch (error) {
      console.error('Auth rate limiter error:', error);
      next();
    }
  };
};

module.exports = {
  createRateLimiter,
  analysisRateLimiter,
  authRateLimiter
};
