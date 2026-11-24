const router = require('express').Router();
const controller = require('./products.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const { ROLES } = require('../../config/constants');

router.get('/', controller.list);
router.get('/vip', controller.vip);
router.get('/featured', controller.featured);
router.get('/:id', controller.getOne);
router.get('/:id/variants', controller.getVariants);
router.get('/:id/addons', controller.getAddons);

router.post(
  '/admin',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER),
  controller.create
);
router.patch(
  '/admin/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER),
  controller.update
);
router.delete('/admin/:id', authenticate, authorize(ROLES.SUPER_ADMIN), controller.remove);

module.exports = router;