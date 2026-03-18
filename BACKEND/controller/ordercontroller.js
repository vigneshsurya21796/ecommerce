const asyncHandler = require("express-async-handler");
const Order = require("../model/ordermodel");

const createOrder = asyncHandler(async (req, res) => {
  const { items, totalPrice, shippingAddress, paymentIntentId } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    totalPrice,
    shippingAddress,
    paymentIntentId,
    paymentStatus: paymentIntentId ? "paid" : "pending",
  });

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.json(order);
});

module.exports = { createOrder, getMyOrders, getOrderById };
