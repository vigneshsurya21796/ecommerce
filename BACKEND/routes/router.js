const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Texts = require("../model/goalmodel");
const {
  gettexts,
  postexts,
  puttexts,
  deletetexts,
} = require("../controller/Authcontoller");
const { protect } = require("../middleware/authmiddleware");
router.route("/").get(protect, gettexts).post(protect,postexts);
router.route("/:id").put(protect,puttexts).delete(protect,deletetexts);

module.exports = router;
