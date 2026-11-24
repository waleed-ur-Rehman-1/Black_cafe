const asyncHandler = require('../../shared/asyncHandler');
const ApiResponse = require('../../shared/ApiResponse');
const ApiError = require('../../shared/ApiError');
const { Branch } = require('../../models');
const service = require('./branches.service');

const list = asyncHandler(async (req, res) => {
  const branches = await Branch.find({ isActive: true }).lean();
  res.json(new ApiResponse(200, branches));
});

const getOne = asyncHandler(async (req, res) => {
  const b = await Branch.findById(req.params.id).lean();
  if (!b) throw new ApiError(404, 'Branch not found');
  res.json(new ApiResponse(200, b));
});

const nearest = asyncHandler(async (req, res) => {
  const { lat, lng, orderType } = req.validated.body;
  const result = await service.findNearest({ lat, lng, orderType });
  res.json(new ApiResponse(200, result));
});

const create = asyncHandler(async (req, res) => {
  const branch = await Branch.create(req.body); // Using req.body directly
  res.status(201).json(new ApiResponse(201, branch));
});

const update = asyncHandler(async (req, res) => {
  const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!branch) throw new ApiError(404, 'Branch not found');
  res.json(new ApiResponse(200, branch));
});

const remove = asyncHandler(async (req, res) => {
  const b = await Branch.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!b) throw new ApiError(404, 'Branch not found');
  res.json(new ApiResponse(200, b));
});

module.exports = { list, getOne, nearest, create, update, remove };