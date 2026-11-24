const router = require('express').Router();
const asyncHandler = require('../../shared/asyncHandler');
const ApiResponse = require('../../shared/ApiResponse');
const { Inventory } = require('../../models');
const { authenticate, authorize } = require('../../middleware/auth');
const { ROLES } = require('../../config/constants');

router.get(
  '/:branchId',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.KITCHEN_STAFF),
  asyncHandler(async (req, res) => {
    const inv = await Inventory.find({ branchId: req.params.branchId }).populate('productId');
    res.json(new ApiResponse(200, inv));
  })
);

router.get(
  '/low-stock/:branchId',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER),
  asyncHandler(async (req, res) => {
    const inv = await Inventory.find({ branchId: req.params.branchId })
      .where('$expr').lt('$availableQuantity', '$lowStockThreshold');
    res.json(new ApiResponse(200, inv));
  })
);

router.post(
  '/adjustments',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER),
  asyncHandler(async (req, res) => {
    const { branchId, productId, quantity } = req.body;
    const inv = await Inventory.findOneAndUpdate(
      { branchId, productId },
      { $inc: { availableQuantity: quantity } },
      { new: true, upsert: true }
    );
    res.json(new ApiResponse(200, inv));
  })
);

module.exports = router;