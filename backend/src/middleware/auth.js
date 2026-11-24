const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../shared/ApiError');
const { User } = require('../models');

async function authenticate(req, res, next) {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) throw new ApiError(401, 'Authentication required');
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user || !user.isActive) throw new ApiError(401, 'User not found');
    req.user = user;
    next();
  } catch (err) {
    next(err instanceof ApiError ? err : new ApiError(401, 'Invalid token'));
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(new ApiError(401, 'Not authenticated'));
    if (roles.length && !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden'));
    }
    next();
  };
}

// Optional auth — sets req.user if token present, else continues
async function optionalAuth(req, res, next) {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization || '').replace('Bearer ', '');
    if (token) {
      const payload = jwt.verify(token, env.jwtSecret);
      req.user = await User.findById(payload.sub).select('-passwordHash');
    }
  } catch (_) {}
  next();
}

module.exports = { authenticate, authorize, optionalAuth };