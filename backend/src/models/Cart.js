const { Schema, model } = require('mongoose');

const cartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: Schema.Types.ObjectId, ref: 'Variant' },
    addonIds: [{ type: Schema.Types.ObjectId, ref: 'Addon' }],
    quantity: { type: Number, default: 1, min: 1 },
    instructions: String,
  },
  { _id: true }
);

const cartSchema = new Schema(
  {
    owner: {
      kind: { type: String, enum: ['USER', 'GUEST'], default: 'GUEST' },
      id: { type: String, required: true, index: true }, // userId or anonymous cartId
    },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = model('Cart', cartSchema);