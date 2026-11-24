const mongoose = require('mongoose');
const asyncHandler = require('../../shared/asyncHandler');
const ApiResponse = require('../../shared/ApiResponse');
const ApiError = require('../../shared/ApiError');
const { Order, Branch } = require('../../models');
const service = require('./orders.service');
const cancellation = require('./cancellation.service');

const create = asyncHandler(async (req, res) => {
  const body = req.validated.body;
  const branch = await Branch.findById(body.branchId);
  
  if (!branch || !branch.isActive) {
    throw new ApiError(400, 'The selected branch is no longer available. Please refresh the page and select your location again.');
  }
  
  const order = await service.createOrder({
    customerId: req.user?._id,
    guestDetails: req.user ? undefined : body.guestDetails,
    branchId: body.branchId,
    orderType: body.orderType,
    items: body.items,
    paymentMethod: body.paymentMethod,
    deliveryAddress: body.deliveryAddress,
  });
  res.status(201).json(new ApiResponse(201, order));
});

const getOne = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.productId');
  if (!order) throw new ApiError(404, 'Order not found');
  
  if (req.user && !['SUPER_ADMIN', 'BRANCH_MANAGER'].includes(req.user.role)) {
    if (String(order.customerId) !== String(req.user._id)) {
      throw new ApiError(403, 'Forbidden');
    }
  }
  res.json(new ApiResponse(200, order));
});

const myOrders = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, 'Login required');
  const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
  res.json(new ApiResponse(200, orders));
});

const track = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = mongoose.isValidObjectId(id) 
    ? { $or: [{ _id: id }, { orderNumber: id }] } 
    : { orderNumber: id };

  const order = await Order.findOne(query)
    .select('_id orderNumber orderStatus paymentStatus paymentMethod orderType total createdAt items');
    
  if (!order) throw new ApiError(404, 'Order not found');
  res.json(new ApiResponse(200, order));
});

const cancel = asyncHandler(async (req, res) => {
  const updated = await cancellation.cancelOrder(req.params.id, req.user);
  res.json(new ApiResponse(200, updated, 'Order cancelled'));
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: status },
    { new: true }
  );
  if (!order) throw new ApiError(404, 'Order not found');
  res.json(new ApiResponse(200, order));
});

// Admin Route
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(new ApiResponse(200, orders));
});

module.exports = { create, getOne, myOrders, track, cancel, updateStatus, getAllOrders };