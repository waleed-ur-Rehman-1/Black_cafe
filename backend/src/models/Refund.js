const { Schema, model } = require('mongoose');
module.exports = model(
  'Refund',
  new Schema(
    {
      orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
      paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },
      refundReference: { type: String, required: true, unique: true },
      amount: { type: Number, required: true },
      reason: String,
      status: {
        type: String,
        enum: ['REFUND_PENDING', 'REFUND_PROCESSING', 'REFUNDED', 'REFUND_FAILED'],
        default: 'REFUND_PENDING',
        index: true,
      },
      gatewayRefundReference: String,
      requestedAt: { type: Date, default: Date.now },
      completedAt: Date,
      authorizedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
  )
);