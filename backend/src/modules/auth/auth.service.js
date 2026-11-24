const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const ApiError = require('../../shared/ApiError');
const { User } = require('../../models');
const { ROLES } = require('../../config/constants');

function signTokens(user) {
  const accessToken = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
  const refreshToken = jwt.sign(
    { sub: user._id.toString() },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiresIn }
  );
  return { accessToken, refreshToken };
}

async function register({ name, email, phone, password, role, setupKey }) {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');

  // Only SUPER_ADMIN creation requires the setup key
  let finalRole = ROLES.CUSTOMER;
  if (role && role !== ROLES.CUSTOMER) {
    if (setupKey !== env.adminSetupKey) throw new ApiError(403, 'Invalid setup key');
    finalRole = role;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, phone, passwordHash, role: finalRole });
  const tokens = signTokens(user);
  return { user: user.toObject({ virtuals: true, versionKey: false }), tokens };
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !user.isActive) throw new ApiError(401, 'Invalid credentials');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, 'Invalid credentials');
  const tokens = signTokens(user);
  const safeUser = await User.findById(user._id);
  return { user: safeUser, tokens };
}

function verifyRefresh(token) {
  return jwt.verify(token, env.jwtRefreshSecret);
}

async function refreshAccess(refreshToken) {
  const payload = verifyRefresh(refreshToken);
  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) throw new ApiError(401, 'Invalid user');
  return signTokens(user);
}

module.exports = { register, login, refreshAccess, signTokens };