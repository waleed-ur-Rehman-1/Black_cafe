const { Schema, model } = require('mongoose');
const { ROLES } = require('../config/constants');

const addressSchema = new Schema(
  {
    label: String,
    address: String,
    latitude: Number,
    longitude: Number,
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CUSTOMER,
      index: true,
    },
    addresses: [addressSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);