const asyncHandler = require('../../shared/asyncHandler');
const ApiResponse = require('../../shared/ApiResponse');
const { Refund } = require('../../models');
const { refundService } = require('./refund.service');

const list = asyncHandler(async (req, res) => {
  const refunds = await Refund.find().populate('orderId').sort({ createdAt: -1 });
  res.json(new ApiResponse(200, refunds));
});

const getOne = asyncHandler(async (req, res) => {
  const refund = await Refund.findById(req.params.id);
  res.json(new ApiResponse(200, refund));
});

const complete = asyncHandler(async (req, res) => {
  const { gatewayRefundReference } = req.body;
  const refund = await refundService.completeRefund(req.params.id, gatewayRefundReference);
  res.json(new ApiResponse(200, refund));
});

const fail = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const refund = await refundService.failRefund(req.params.id, reason);
  res.json(new ApiResponse(200, refund));
});

module.exports = { list, getOne, complete, fail };