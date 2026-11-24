const { Schema, model } = require('mongoose');
module.exports = model(
  'Staff',
  new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
      position: String,
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  )
);