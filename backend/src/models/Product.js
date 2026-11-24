const { Schema, model } = require('mongoose');
const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    images: [String],
    variantIds: [{ type: Schema.Types.ObjectId, ref: 'Variant' }],
    addonIds: [{ type: Schema.Types.ObjectId, ref: 'Addon' }],
    isVIP: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    preparationTime: { type: Number, default: 15 }, // minutes
    basePrice: { type: Number, default: 0 },        // paisa, used if no variants
  },
  { timestamps: true }
);
module.exports = model('Product', productSchema);