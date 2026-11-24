const mongoose = require('mongoose');
const asyncHandler = require('../../shared/asyncHandler');
const ApiResponse = require('../../shared/ApiResponse');
const ApiError = require('../../shared/ApiError');
// Added Inventory and Branch to the imports
const { Product, Variant, Addon, Inventory, Branch } = require('../../models');

const list = asyncHandler(async (req, res) => {
  const { category, vip, featured, q, page = 1, limit = 1000 } = req.query;
  const filter = { isActive: true };
  if (category) filter.categoryId = category;
  if (vip === 'true') filter.isVIP = true;
  if (featured === 'true') filter.isFeatured = true;
  if (q) filter.$text = { $search: q };
  
  const products = await Product.find(filter)
    .populate('variantIds')
    .populate('addonIds')
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .lean();
    
  res.json(new ApiResponse(200, products));
});

const vip = asyncHandler(async (_req, res) => {
  const products = await Product.find({ isActive: true, isVIP: true })
    .populate('variantIds')
    .populate('addonIds')
    .lean();
  res.json(new ApiResponse(200, products));
});

const featured = asyncHandler(async (_req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate('variantIds')
    .populate('addonIds')
    .lean();
  res.json(new ApiResponse(200, products));
});

const getOne = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = mongoose.isValidObjectId(id) 
    ? { $or: [{ _id: id }, { slug: id }] } 
    : { slug: id };

  const p = await Product.findOne(query)
    .populate('variantIds')
    .populate('addonIds')
    .lean();
    
  if (!p) throw new ApiError(404, 'Product not found');
  res.json(new ApiResponse(200, p));
});

const getVariants = asyncHandler(async (req, res) => {
  const variants = await Variant.find({ productId: req.params.id, isActive: true }).lean();
  res.json(new ApiResponse(200, variants));
});

const getAddons = asyncHandler(async (req, res) => {
  const addons = await Addon.find({ isActive: true }).lean();
  res.json(new ApiResponse(200, addons));
});

const create = asyncHandler(async (req, res) => {
  const p = await Product.create(req.body);
  
  // FIX: Automatically create inventory for all active branches
  const branches = await Branch.find({ isActive: true });
  if (branches.length > 0) {
    const inventoryDocs = branches.map(b => ({
      branchId: b._id,
      productId: p._id,
      availableQuantity: 100, // Default stock
      reservedQuantity: 0,
      lowStockThreshold: 10,
      isAvailable: true
    }));
    await Inventory.insertMany(inventoryDocs);
  }

  res.status(201).json(new ApiResponse(201, p));
});

const update = asyncHandler(async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!p) throw new ApiError(404, 'Product not found');
  res.json(new ApiResponse(200, p));
});

const remove = asyncHandler(async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!p) throw new ApiError(404, 'Product not found');
  res.json(new ApiResponse(200, p));
});

module.exports = { list, vip, featured, getOne, getVariants, getAddons, create, update, remove };