const express = require("express");
const userrouter = express.Router();
const {
  registeruser,
  loginuser,
  fetchuser,
} = require("../controller/usercontroller");
const { protect } = require("../middleware/authmiddleware");
userrouter.post("/", registeruser);
userrouter.post("/login", loginuser);
userrouter.get("/", protect, fetchuser);

module.exports = userrouter;
