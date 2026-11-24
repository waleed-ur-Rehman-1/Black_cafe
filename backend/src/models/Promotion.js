const { Schema, model } = require('mongoose');
module.exports = model(
  'Promotion',
  new Schema(
    {
      title: String,
      description: String,
      image: String,
      discountPercent: Number,
      startAt: Date,
      endAt: Date,
      branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  )
);