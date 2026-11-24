const { Schema, model } = require('mongoose');
module.exports = model(
  'Coupon',
  new Schema(
    {
      code: { type: String, required: true, unique: true },
      type: { type: String, enum: ['PERCENT', 'FIXED'], required: true },
      value: { type: Number, required: true }, // percent (0-100) or paisa
      minOrder: Number,
      maxDiscount: Number,
      expiresAt: Date,
      usageLimit: Number,
      usedCount: { type: Number, default: 0 },
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  )
);