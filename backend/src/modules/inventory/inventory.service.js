const { Inventory, StockMovement } = require('../../models');
const ApiError = require('../../shared/ApiError');

async function reserve(branchId, items) {
  const updates = [];
  for (const item of items) {
    const inv = await Inventory.findOneAndUpdate(
      {
        branchId,
        productId: item.productId,
        availableQuantity: { $gte: item.quantity },
        isAvailable: true,
      },
      { $inc: { availableQuantity: -item.quantity, reservedQuantity: item.quantity } },
      { new: true }
    );
    if (!inv) {
      // rollback previous
      for (const u of updates) {
        await Inventory.updateOne(
          { _id: u._id },
          { $inc: { availableQuantity: u.quantity, reservedQuantity: -u.quantity } }
        );
      }
      throw new ApiError(409, 'Insufficient stock');
    }
    updates.push({ _id: inv._id, quantity: item.quantity });
    await StockMovement.create({
      branchId,
      productId: item.productId,
      type: 'RESERVE',
      quantity: item.quantity,
    });
  }
  return updates;
}

async function release(branchId, items, orderId) {
  for (const item of items) {
    await Inventory.updateOne(
      { branchId, productId: item.productId },
      { $inc: { availableQuantity: item.quantity, reservedQuantity: -item.quantity } }
    );
    await StockMovement.create({
      branchId,
      productId: item.productId,
      type: 'RELEASE',
      quantity: item.quantity,
      orderId,
    });
  }
}

async function consume(branchId, items) {
  for (const item of items) {
    await Inventory.updateOne(
      { branchId, productId: item.productId },
      { $inc: { reservedQuantity: -item.quantity } }
    );
    await StockMovement.create({
      branchId,
      productId: item.productId,
      type: 'CONSUME',
      quantity: item.quantity,
    });
  }
}

module.exports = { reserve, release, consume };