const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  productId: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
});

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usersdata",
      required: true,
    },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "failed"],
    },
    orderStatus: {
      type: String,
      default: "processing",
      enum: ["processing", "shipped", "delivered", "cancelled"],
    },
    paymentIntentId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
