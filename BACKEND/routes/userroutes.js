const express = require("express");
const userrouter = express.Router();
const {
  registeruser,
  loginuser,
  refreshtoken,
  logoutuser,
  fetchuser,
} = require("../controller/usercontroller");
const { protect } = require("../middleware/authmiddleware");

userrouter.post("/", registeruser);
userrouter.post("/login", loginuser);
userrouter.post("/refresh", refreshtoken);
userrouter.post("/logout", logoutuser);
userrouter.get("/", protect, fetchuser);

module.exports = userrouter;
