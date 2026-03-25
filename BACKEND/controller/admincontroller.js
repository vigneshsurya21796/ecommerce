const asyncHandler = require("express-async-handler");
const User    = require("../model/usermodel");
const Order   = require("../model/ordermodel");
const Product = require("../model/productmodel");

// ── Stats ────────────────────────────────────────────────
const getStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalUsers, totalProducts, revenueData] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
  ]);

  const totalRevenue = revenueData[0]?.total || 0;

  // Orders per status
  const ordersByStatus = await Order.aggregate([
    { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
  ]);

  res.json({ totalOrders, totalUsers, totalProducts, totalRevenue, ordersByStatus });
});

// ── Orders ───────────────────────────────────────────────
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) { res.status(404); throw new Error("Order not found"); }

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  const updated = await order.save();
  res.json(updated);
});

// ── Users ─────────────────────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken").sort({ createdAt: -1 });
  res.json(users);
});

const toggleAdminRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -refreshToken");
  if (!user) { res.status(404); throw new Error("User not found"); }
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400); throw new Error("Cannot change your own admin status");
  }
  user.isAdmin = !user.isAdmin;
  await user.save();
  res.json(user);
});

// ── Products ──────────────────────────────────────────────
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, image, stock } = req.body;
  if (!title || !description || !price || !category || !image) {
    res.status(400); throw new Error("Please fill all required fields");
  }
  const product = await Product.create({ title, description, price, category, image, stock });
  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json(updated);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  await product.deleteOne();
  res.json({ id: req.params.id });
});

module.exports = {
  getStats, getAllOrders, updateOrderStatus,
  getAllUsers, toggleAdminRole,
  getAllProducts, createProduct, updateProduct, deleteProduct,
};
