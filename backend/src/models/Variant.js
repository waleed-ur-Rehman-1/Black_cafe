const { Schema, model } = require('mongoose');
module.exports = model(
  'Variant',
  new Schema(
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
      name: { type: String, required: true }, // e.g. Small, Medium
      price: { type: Number, required: true }, // paisa
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  )
);