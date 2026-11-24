const { Schema, model } = require('mongoose');
module.exports = model(
  'DeliveryAssignment',
  new Schema(
    {
      orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
      branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
      staffId: { type: Schema.Types.ObjectId, ref: 'User' },
      status: {
        type: String,
        enum: ['ASSIGNED', 'PICKED_UP', 'DELIVERED', 'FAILED'],
        default: 'ASSIGNED',
      },
      deliveredAt: Date,
    },
    { timestamps: true }
  )
);