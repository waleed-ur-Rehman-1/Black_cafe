const mongoose = require('mongoose');
const ApiError = require('../../shared/ApiError');
const env = require('../../config/env');
const { Order, Product, Variant, Addon, Inventory, Setting } = require('../../models');
const inventoryService = require('../inventory/inventory.service');
const { ORDER_STATUS, ORDER_TYPES, PAYMENT_METHODS } = require('../../config/constants');

async function generateOrderNumber() {
  const count = await Order.countDocuments();
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `BC-${date}-${String(count + 1).padStart(5, '0')}`;
}

async function priceOrderItems(branchId, rawItems) {
  let subtotal = 0;
  const items = [];

  for (const raw of rawItems) {
   const product = await Product.findById(raw.productId);
if (!product) {
  throw new ApiError(400, 'A product in your cart no longer exists. Please clear your cart and add it again.');
}
if (!product.isActive) {
  throw new ApiError(400, `The product "${product.name}" is currently unavailable.`);
}

    let unitPrice = product.basePrice;
    let size = null;
    if (raw.variantId) {
      const variant = await Variant.findById(raw.variantId);
      if (!variant || !variant.isActive || variant.productId.toString() !== product._id.toString()) {
        throw new ApiError(400, 'Invalid variant');
      }
      unitPrice = variant.price;
      size = variant.name;
    }

    const addons = [];
    let addonTotal = 0;
    if (Array.isArray(raw.addonIds)) {
      for (const aid of raw.addonIds) {
        const addon = await Addon.findById(aid);
        if (!addon || !addon.isActive) throw new ApiError(400, 'Invalid addon');
        addons.push({ addonId: addon._id, name: addon.name, price: addon.price });
        addonTotal += addon.price;
      }
    }

    const qty = Math.max(1, Math.floor(raw.quantity || 1));
    const lineTotal = (unitPrice + addonTotal) * qty;
    subtotal += lineTotal;

    items.push({
      productId: product._id,
      productName: product.name,
      variantId: raw.variantId || undefined,
      size,
      addons,
      quantity: qty,
      unitPrice: unitPrice + addonTotal,
      subtotal: lineTotal,
      instructions: raw.instructions || '',
    });
  }

  return { items, subtotal };
}

async function createOrder({ customerId, guestDetails, branchId, orderType, items, paymentMethod, deliveryAddress }) {
  if (!Array.isArray(items) || !items.length) throw new ApiError(400, 'Cart is empty');

  const { items: pricedItems, subtotal } = await priceOrderItems(branchId, items);

  let deliveryFee = 0;
  if (orderType === ORDER_TYPES.DELIVERY) {
    const setting = await Setting.findOne({ key: 'deliveryFee', branchId });
    deliveryFee = setting?.value ?? 0;
  }

  const orderNumber = await generateOrderNumber();
  const cancellationDeadline = new Date(Date.now() + env.cancellationWindowMs);
  const total = subtotal + deliveryFee;

  // 1. Reserve Inventory (No Transactions)
  await inventoryService.reserve(
    branchId,
    pricedItems.map((i) => ({ productId: i.productId, quantity: i.quantity }))
  );

  // 2. Create the Order
  try {
    const order = await Order.create({
      orderNumber,
      customerId,
      guestDetails,
      branchId,
      orderType,
      items: pricedItems,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      orderStatus:
        paymentMethod === PAYMENT_METHODS.COD || paymentMethod === PAYMENT_METHODS.CASH_PICKUP
          ? ORDER_STATUS.PENDING
          : ORDER_STATUS.PAYMENT_PENDING,
      paymentStatus: 'PENDING',
      cancellationDeadline,
      deliveryAddress,
    });

    return order;
  } catch (err) {
    // 3. Manual Rollback: If order creation fails, release the inventory we just reserved
    await inventoryService.release(
      branchId,
      pricedItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      null
    );
    throw err;
  }
}

module.exports = { createOrder, generateOrderNumber };