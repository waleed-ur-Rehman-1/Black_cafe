const { Schema, model } = require('mongoose');
module.exports = model(
  'StockMovement',
  new Schema(
    {
      branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      type: {
        type: String,
        enum: ['RESERVE', 'RELEASE', 'CONSUME', 'ADJUST', 'RESTOCK'],
        required: true,
      },
      quantity: { type: Number, required: true },
      orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
      note: String,
    },
    { timestamps: true }
  )
);