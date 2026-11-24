const { Schema, model } = require('mongoose');
module.exports = model(
  'Category',
  new Schema(
    {
      name: { type: String, required: true, unique: true },
      slug: { type: String, required: true, unique: true },
      description: String,
      image: String,
      sortOrder: { type: Number, default: 0 },
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  )
);