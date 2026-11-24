const asyncHandler = require('../../shared/asyncHandler');
const ApiResponse = require('../../shared/ApiResponse');
const ApiError = require('../../shared/ApiError');
const service = require('./payments.service');
const { Payment } = require('../../models'); // Make sure Payment model is imported

const initiate = asyncHandler(async (req, res) => {
  const result = await service.initiate(req.body);
  res.status(201).json(new ApiResponse(201, result));
});

const webhook = asyncHandler(async (req, res) => {
  const result = await service.handleWebhook({
    provider: req.params.provider,
    payload: req.body,
    signature: req.headers['x-gateway-signature'],
  });
  res.json(new ApiResponse(200, result));
});

const list = asyncHandler(async (req, res) => {
  const payments = await Payment.find().sort({ createdAt: -1 });
  res.json(new ApiResponse(200, payments));
});

module.exports = { initiate, webhook, list };