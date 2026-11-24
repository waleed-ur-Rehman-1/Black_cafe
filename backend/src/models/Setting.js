const { Schema, model } = require('mongoose');
module.exports = model(
  'Setting',
  new Schema(
    {
      key: { type: String, required: true, unique: true },
      value: Schema.Types.Mixed,
      branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    },
    { timestamps: true }
  )
);