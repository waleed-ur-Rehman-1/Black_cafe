const { Schema, model } = require('mongoose');

const branchSchema = new Schema(
  {
    name: { type: String, required: true },
    branchCode: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    phone: { type: String }, // <-- Already there
    email: { type: String }, // <-- ADD THIS LINE
    openingHours: { open: String, close: String },
    deliveryRadius: { type: Number, default: 5 },
    deliveryFee: { type: Number, default: 0 },
    isDeliveryEnabled: { type: Boolean, default: true },
    isPickupEnabled: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    manager: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

branchSchema.index({ location: '2dsphere' });

module.exports = model('Branch', branchSchema);