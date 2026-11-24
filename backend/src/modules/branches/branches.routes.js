const router = require('express').Router();
const { z } = require('zod');
const controller = require('./branches.controller');
const validate = require('../../middleware/validate');
const { authenticate, authorize } = require('../../middleware/auth');
const { ROLES } = require('../../config/constants');

const nearestSchema = z.object({
  body: z.object({
    lat: z.number(),
    lng: z.number(),
    orderType: z.enum(['DELIVERY', 'PICKUP']).optional(),
  }),
});

const createSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    branchCode: z.string().min(2),
    address: z.string().min(5),
    location: z.object({ coordinates: z.array(z.number()).length(2) }),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')), // <-- ADDED EMAIL
    deliveryRadius: z.number().optional(),
    deliveryFee: z.number().optional(),
  }),
});

router.get('/', controller.list);
router.post('/nearest', validate(nearestSchema), controller.nearest);
router.get('/:id', controller.getOne);
router.post('/admin', authenticate, authorize(ROLES.SUPER_ADMIN), validate(createSchema), controller.create);
router.patch('/admin/:id', authenticate, authorize(ROLES.SUPER_ADMIN), controller.update);
router.delete('/admin/:id', authenticate, authorize(ROLES.SUPER_ADMIN), controller.remove);

module.exports = router;