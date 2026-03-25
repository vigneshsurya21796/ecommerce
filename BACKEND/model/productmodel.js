const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title:       { type: String, required: [true, "Title is required"] },
    description: { type: String, required: [true, "Description is required"] },
    price:       { type: Number, required: [true, "Price is required"], min: 0 },
    category:    { type: String, required: [true, "Category is required"] },
    image:       { type: String, required: [true, "Image URL is required"] },
    stock:       { type: Number, default: 100, min: 0 },
    rating:      { rate: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
