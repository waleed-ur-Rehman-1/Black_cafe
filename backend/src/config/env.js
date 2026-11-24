require('dotenv').config();
const required = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
for (const k of required) {
  if (!process.env[k]) throw new Error(`Missing required env: ${k}`);
}
module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  corsOrigins: (process.env.CORS_ORIGIN || '').split(',').filter(Boolean),
  adminSetupKey: process.env.ADMIN_SETUP_KEY,
   geminiKey: process.env.GEMINI_API_KEY, 
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  cancellationWindowMs: Number(process.env.CANCELLATION_WINDOW_MS || 5 * 60 * 1000),
};