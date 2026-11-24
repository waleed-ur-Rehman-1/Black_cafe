const { Schema, model } = require('mongoose');
module.exports = model(
  'Payment',
  new Schema(
    {
      orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
      provider: { type: String, required: true }, // easypaisa, jazzcash, card, cash
      method: { type: String, required: true },
      transactionReference: { type: String, required: true, unique: true },
      gatewayReference: String,
      amount: { type: Number, required: true }, // paisa
      currency: { type: String, default: 'PKR' },
      status: { type: String, default: 'INITIATED', index: true },
      verifiedAt: Date,
      rawGatewayResponse: { type: Object, select: false },
    },
    { timestamps: true }
  )
);