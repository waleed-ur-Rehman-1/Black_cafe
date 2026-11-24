const asyncHandler = require('../../shared/asyncHandler');
const ApiResponse = require('../../shared/ApiResponse');
const service = require('./chatbot.service');

const chat = asyncHandler(async (req, res) => {
  const { message, branchId, previousInteractionId } = req.body;
  const result = await service.chat({ message, branchId, previousInteractionId });
  res.json(new ApiResponse(200, result));
});

module.exports = { chat };