const router = require('express').Router();
const controller = require('./refund.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const { ROLES } = require('../../config/constants');

router.get('/', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.FINANCE_MANAGER), controller.list);
router.get('/:id', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.FINANCE_MANAGER), controller.getOne);
router.patch('/:id/complete', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.FINANCE_MANAGER), controller.complete);
router.patch('/:id/fail', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.FINANCE_MANAGER), controller.fail);

module.exports = router;