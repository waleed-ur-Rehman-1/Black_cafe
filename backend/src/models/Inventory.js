const { Schema, model } = require('mongoose');
const invSchema = new Schema(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    availableQuantity: { type: Number, default: 0 },
    reservedQuantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);
invSchema.index({ branchId: 1, productId: 1 }, { unique: true });
module.exports = model('Inventory', invSchema);