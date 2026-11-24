const { Schema, model } = require('mongoose');
module.exports = model(
  'Addon',
  new Schema(
    {
      name: { type: String, required: true }, // e.g. Extra Cheese
      price: { type: Number, required: true }, // paisa
      type: { type: String, enum: ['SAUCE', 'TOPPING', 'CRUST'], default: 'TOPPING' },
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  )
);