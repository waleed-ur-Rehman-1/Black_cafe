const router = require('express').Router();

router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/branches', require('../modules/branches/branches.routes'));
router.use('/products', require('../modules/products/products.routes'));
router.use('/inventory', require('../modules/inventory/inventory.routes'));
router.use('/orders', require('../modules/orders/orders.routes'));
router.use('/payments', require('../modules/payments/payments.routes'));
router.use('/refunds', require('../modules/refunds/refund.routes'));
router.use('/chatbot', require('../modules/chatbot/chatbot.routes'));
router.use('/admin/analytics', require('../modules/analytics/analytics.routes'));
router.use('/categories', require('../modules/categories/categories.routes'));

router.get('/health', (_req, res) => res.json({ success: true, status: 'ok' }));

module.exports = router;