const express = require("express");
const productRouter = express.Router();
const asyncHandler = require("express-async-handler");
const Product = require("../model/productmodel");

// Public: get all products
productRouter.get("/", asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json(products);
}));

// Public: get single product
productRouter.get("/:id", asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
}));

module.exports = productRouter;
