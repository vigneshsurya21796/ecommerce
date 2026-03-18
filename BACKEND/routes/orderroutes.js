const express = require("express");
const orderRouter = express.Router();
const { createOrder, getMyOrders, getOrderById } = require("../controller/ordercontroller");
const { protect } = require("../middleware/authmiddleware");

orderRouter.post("/", protect, createOrder);
orderRouter.get("/", protect, getMyOrders);
orderRouter.get("/:id", protect, getOrderById);

module.exports = orderRouter;
