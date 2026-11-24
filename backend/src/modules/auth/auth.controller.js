const asyncHandler = require('../../shared/asyncHandler');
const ApiResponse = require('../../shared/ApiResponse');
const ApiError = require('../../shared/ApiError');
const service = require('./auth.service');
const env = require('../../config/env');

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
  path: '/',
};

const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, setupKey } = req.validated.body;
  const { user, tokens } = await service.register({
    name, email, phone, password, role, setupKey,
  });
  res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.status(201).json(new ApiResponse(201, { user, tokens }));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const { user, tokens } = await service.login({ email, password });
  res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.status(200).json(new ApiResponse(200, { user, tokens }));
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json(new ApiResponse(200, null, 'Logged out'));
});

const me = asyncHandler(async (req, res) => {
  // FIX: If no user, return null but 200 OK. Don't throw a 401.
  res.status(200).json(new ApiResponse(200, { user: req.user || null }));
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(400, 'refreshToken required');
  const tokens = await service.refreshAccess(refreshToken);
  res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.status(200).json(new ApiResponse(200, tokens));
});

module.exports = { register, login, logout, me, refresh };