const crypto = require('crypto');
const ApiError = require('../../shared/ApiError');
const { Payment, Order } = require('../../models');
const { PAYMENT_STATUS, ORDER_STATUS } = require('../../config/constants');

function generateReference(prefix = 'TXN') {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
}

async function initiate({ orderId, method }) {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.paymentStatus === PAYMENT_STATUS.SUCCESS) {
    throw new ApiError(409, 'Order already paid');
  }

  const reference = generateReference('BC');
  const payment = await Payment.create({
    orderId: order._id,
    provider: method.toLowerCase(),
    method,
    transactionReference: reference,
    amount: order.total,
    status: PAYMENT_STATUS.INITIATED,
  });

  // Adapter dispatch
  if (method === 'EASYPAISA') {
    return { payment, redirectUrl: `https://sandbox.easypaisa.example/pay?ref=${reference}` };
  }
  if (method === 'JAZZCASH') {
    return { payment, redirectUrl: `https://sandbox.jazzcash.example/pay?ref=${reference}` };
  }
  if (method === 'CARD') {
    return { payment, redirectUrl: `https://sandbox.cardgw.example/checkout?ref=${reference}` };
  }
  throw new ApiError(400, 'Unsupported online method');
}

// Idempotent webhook handler
async function handleWebhook({ provider, payload, signature }) {
  // 1. Verify signature (stub — replace with real gateway secret)
  const expected = crypto
    .createHmac('sha256', process.env[`${provider.toUpperCase()}_WEBHOOK_SECRET`] || 'secret')
    .update(JSON.stringify(payload))
    .digest('hex');
  if (signature && signature !== expected) {
    throw new ApiError(401, 'Invalid signature');
  }

  const { transactionReference, status, gatewayReference, amount } = payload;
  if (!transactionReference) throw new ApiError(400, 'Missing transactionReference');

  // 2. Idempotency — reject duplicate success
  const existing = await Payment.findOne({ transactionReference });
  if (!existing) throw new ApiError(404, 'Payment not found');
  if (existing.status === PAYMENT_STATUS.SUCCESS) {
    return { duplicate: true, payment: existing };
  }

  // 3. Amount validation
  if (Number(amount) !== existing.amount) {
    throw new ApiError(400, 'Amount mismatch');
  }

  // 4. Update atomically
  const updated = await Payment.findOneAndUpdate(
    { transactionReference, status: { $ne: PAYMENT_STATUS.SUCCESS } },
    {
      $set: {
        status: status === 'SUCCESS' ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.FAILED,
        gatewayReference,
        verifiedAt: new Date(),
      },
    },
    { new: true }
  );

  // 5. Cascade to order
  if (updated && updated.status === PAYMENT_STATUS.SUCCESS) {
    await Order.findByIdAndUpdate(updated.orderId, {
      paymentStatus: PAYMENT_STATUS.SUCCESS,
      orderStatus: ORDER_STATUS.ACCEPTED,
    });
  }
  return { duplicate: false, payment: updated };
}

module.exports = { initiate, handleWebhook, generateReference };