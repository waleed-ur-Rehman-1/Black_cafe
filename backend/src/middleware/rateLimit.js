const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many attempts, try later' },
});

const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 120 });

module.exports = { authLimiter, apiLimiter };