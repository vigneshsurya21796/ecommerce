const express = require("express");
const paymentRouter = express.Router();
const { createPaymentIntent } = require("../controller/paymentcontroller");
const { protect } = require("../middleware/authmiddleware");

paymentRouter.post("/create-intent", protect, createPaymentIntent);

module.exports = paymentRouter;
