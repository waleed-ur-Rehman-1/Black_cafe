const { Schema, model } = require('mongoose');
module.exports = model(
  'Review',
  new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      productId: { type: Schema.Types.ObjectId, ref: 'Product' },
      orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      isVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);