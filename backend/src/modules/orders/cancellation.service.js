const ApiError = require('../../shared/ApiError');
const { Order, Payment } = require('../../models');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../../config/constants');
const { refundService } = require('../refunds/refund.service');

const CANCELLATION_WINDOW_MS = 5 * 60 * 1000;
const CANCELLABLE_STATES = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PAYMENT_PENDING,
  ORDER_STATUS.ACCEPTED,
];

async function cancelOrder(orderId, actor) {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  // FIX: Guest orders have no customerId. Registered orders must match the user.
  if (order.customerId) {
    if (!actor) throw new ApiError(401, 'Please login to cancel this order');
    const isOwner = String(order.customerId) === String(actor._id);
    const isAdmin = actor && ['SUPER_ADMIN', 'BRANCH_MANAGER'].includes(actor.role);
    if (!isOwner && !isAdmin) throw new ApiError(403, 'Forbidden');
  }

  if (!CANCELLABLE_STATES.includes(order.orderStatus)) {
    throw new ApiError(400, `Cannot cancel order in state ${order.orderStatus}. It is already being prepared.`);
  }

  const elapsed = Date.now() - new Date(order.createdAt).getTime();
  if (elapsed > CANCELLATION_WINDOW_MS) {
    throw new ApiError(400, 'The 5-minute cancellation window has expired.');
  }

  const updated = await Order.findOneAndUpdate(
    { _id: orderId, orderStatus: { $in: CANCELLABLE_STATES } },
    { $set: { orderStatus: ORDER_STATUS.CANCELLED, cancelledAt: new Date() } },
    { new: true }
  );
  if (!updated) throw new ApiError(409, 'Order state changed, try again');

  try {
    const inventoryService = require('../inventory/inventory.service');
    await inventoryService.release(
      updated.branchId,
      updated.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      updated._id
    );
  } catch (e) {
    console.error('Inventory release failed', e);
  }

  if (updated.paymentStatus === PAYMENT_STATUS.SUCCESS) {
    const payment = await Payment.findOne({ orderId: updated._id, status: 'SUCCESS' });
    if (payment) {
      await refundService.createRefund({
        orderId: updated._id,
        paymentAmount: payment.amount,
        paymentId: payment._id,
        reason: 'Customer cancelled within 5-minute window',
      });
    }
  }

  return updated;
}

module.exports = { cancelOrder, CANCELLATION_WINDOW_MS };