const router = require('express').Router();
const controller = require('./auth.controller');
const { authLimiter } = require('../../middleware/rateLimit');
const validate = require('../../middleware/validate');
const { z } = require('zod');
const { optionalAuth } = require('../../middleware/auth'); // <-- Only import optionalAuth

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(8),
    role: z.string().optional(),
    setupKey: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

router.post('/register', authLimiter, validate(registerSchema), controller.register);
router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.post('/logout', controller.logout);
router.post('/refresh', controller.refresh);

// FIX: Use optionalAuth so guests don't get a 401 error
router.get('/me', optionalAuth, controller.me); 

module.exports = router;