const router = require('express').Router();
const controller = require('./categories.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const { ROLES } = require('../../config/constants');

router.get('/', controller.list);
router.post('/', authenticate, authorize(ROLES.SUPER_ADMIN), controller.create);

module.exports = router;