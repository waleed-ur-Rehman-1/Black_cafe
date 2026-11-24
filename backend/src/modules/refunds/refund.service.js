const crypto = require('crypto');
const ApiError = require('../../shared/ApiError');
const { Refund, Payment, Order } = require('../../models');
const { PAYMENT_STATUS } = require('../../config/constants');

const refundService = {
  async createRefund({ orderId, paymentId, amount, reason, authorizedBy }) {
    const ref = `REF-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const refund = await Refund.create({
      orderId,
      paymentId,
      refundReference: ref,
      amount,
      reason,
      status: 'REFUND_PENDING',
      authorizedBy,
    });
    await Payment.findByIdAndUpdate(paymentId, { status: PAYMENT_STATUS.REFUND_PENDING });
    // In production: enqueue job to call gateway refund API
    return refund;
  },

  async completeRefund(refundId, gatewayRefundReference) {
    const refund = await Refund.findByIdAndUpdate(
      refundId,
      {
        status: 'REFUNDED',
        gatewayRefundReference,
        completedAt: new Date(),
      },
      { new: true }
    );
    if (!refund) throw new ApiError(404, 'Refund not found');
    await Payment.findByIdAndUpdate(refund.paymentId, { status: PAYMENT_STATUS.REFUNDED });
    return refund;
  },

  async failRefund(refundId, reason) {
    const refund = await Refund.findByIdAndUpdate(
      refundId,
      { status: 'REFUND_FAILED', reason },
      { new: true }
    );
    if (!refund) throw new ApiError(404, 'Refund not found');
    await Payment.findByIdAndUpdate(refund.paymentId, { status: PAYMENT_STATUS.REFUND_FAILED });
    return refund;
  },
};

module.exports = { refundService };