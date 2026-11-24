const router = require('express').Router();
const { z } = require('zod');
const controller = require('./orders.controller');
const validate = require('../../middleware/validate');
const { authenticate, optionalAuth, authorize } = require('../../middleware/auth');
const { ROLES } = require('../../config/constants');

// Define the validation schema
const createSchema = z.object({
  body: z.object({
    branchId: z.string({ required_error: "Branch ID is required" }),
    orderType: z.enum(['DELIVERY', 'PICKUP']),
    items: z.array(z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      addonIds: z.array(z.string()).optional(),
      quantity: z.number().int().positive(),
      instructions: z.string().optional(),
    })).min(1, "Cart must have at least 1 item"),
    paymentMethod: z.enum(['EASYPAISA', 'JAZZCASH', 'CARD', 'COD', 'CASH_PICKUP']),
    deliveryAddress: z.object({
      address: z.string().min(5, "Address is too short"),
      latitude: z.number(),
      longitude: z.number(),
    }).optional(),
    guestDetails: z.object({
      name: z.string().min(2, "Name is required"),
      phone: z.string().min(10, "Valid phone required"),
      email: z.string().email().optional().or(z.literal('')),
    }).optional(),
  }),
});

// Routes
router.post('/', optionalAuth, validate(createSchema), controller.create);
router.get('/my-orders', authenticate, controller.myOrders);
router.get('/track/:id', controller.track);

// Admin route (must be before /:id)
router.get('/admin/all', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.KITCHEN_STAFF), controller.getAllOrders);

router.get('/:id', optionalAuth, controller.getOne);
router.post('/:id/cancel', optionalAuth, controller.cancel); // optionalAuth allows guests to cancel
router.patch('/:id/status', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.KITCHEN_STAFF), controller.updateStatus);

module.exports = router;