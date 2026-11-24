const asyncHandler = require('../../shared/asyncHandler');
const ApiResponse = require('../../shared/ApiResponse');
const ApiError = require('../../shared/ApiError');
const { Category } = require('../../models');

const list = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.json(new ApiResponse(200, categories));
});

const create = asyncHandler(async (req, res) => {
  const cat = await Category.create(req.body);
  res.status(201).json(new ApiResponse(201, cat));
});

module.exports = { list, create };