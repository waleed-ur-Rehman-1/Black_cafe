const router = require('express').Router();
const controller = require('./payments.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const { ROLES } = require('../../config/constants');

// Public routes
router.post('/initiate', controller.initiate);
router.post('/webhooks/:provider', controller.webhook);

// Admin routes
router.get(
  '/admin/list', 
  authenticate, 
  authorize(ROLES.SUPER_ADMIN, ROLES.FINANCE_MANAGER), 
  controller.list
);

module.exports = router;