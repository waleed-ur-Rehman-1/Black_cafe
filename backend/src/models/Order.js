const { Schema, model } = require('mongoose');
const { ORDER_STATUS, PAYMENT_METHODS, ORDER_TYPES } = require('../config/constants');

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: String,
    variantId: { type: Schema.Types.ObjectId, ref: 'Variant' },
    size: String,
    addons: [
      {
        addonId: { type: Schema.Types.ObjectId, ref: 'Addon' },
        name: String,
        price: Number,
      },
    ],
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true }, // paisa
    subtotal: { type: Number, required: true },  // paisa
    instructions: String,
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    guestDetails: {
      name: String,
      phone: String,
      email: String,
    },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    orderType: { type: String, enum: Object.values(ORDER_TYPES), required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      required: true,
    },
    paymentStatus: { type: String, default: 'PENDING' },
    orderStatus: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      index: true,
    },
    cancellationDeadline: { type: Date, required: true },
    cancelledAt: Date,
    deliveryAddress: {
      address: String,
      latitude: Number,
      longitude: Number,
    },
  },
  { timestamps: true }
);

orderSchema.index({ branchId: 1, orderStatus: 1, createdAt: -1 });

module.exports = model('Order', orderSchema);