const ApiError = require('../shared/ApiError');
const env = require('../config/env');

function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

function errorHandler(err, req, res, _next) {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Validation Errors (Missing required fields)
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  
  // Handle Duplicate Keys (e.g., Branch Code already exists)
  if (err.code === 11000) {
    status = 409;
    message = `Duplicate key error: A record with this ${Object.keys(err.keyPattern).join(', ')} already exists.`;
  }

  // Handle Cast Errors (e.g., sending text where a number is expected)
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid format for ${err.path}. Expected a ${err.kind}.`;
  }

  if (env.nodeEnv === 'production' && status === 500) {
    message = 'Internal Server Error';
  }

  // Print to terminal so we can see what went wrong
  if (status === 500) {
    console.error('🔥 SERVER ERROR:', err);
  }

  res.status(status).json({
    success: false,
    message,
    details: err.details || undefined,
    stack: env.nodeEnv === 'development' ? err.stack : undefined,
  });
}

module.exports = { notFound, errorHandler };