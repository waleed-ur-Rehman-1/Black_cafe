const router = require('express').Router();
const asyncHandler = require('../../shared/asyncHandler');
const ApiResponse = require('../../shared/ApiResponse');
const { Order, Payment, Inventory } = require('../../models');
const { authenticate, authorize } = require('../../middleware/auth');
const { ROLES } = require('../../config/constants');

router.get(
  '/dashboard',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.FINANCE_MANAGER),
  asyncHandler(async (req, res) => {
    const [totalOrders, todayOrders, pendingOrders, lowStock] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
      Order.countDocuments({ orderStatus: { $in: ['PENDING', 'PREPARING', 'ACCEPTED'] } }),
      Inventory.countDocuments({ $expr: { $lt: ['$availableQuantity', '$lowStockThreshold'] } }),
    ]);
    const revenueAgg = await Payment.aggregate([
      { $match: { status: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    res.json(new ApiResponse(200, {
      totalOrders, todayOrders, pendingOrders, lowStock,
      totalRevenuePaisa: revenueAgg[0]?.total || 0,
    }));
  })
);

module.exports = router;