const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/usermodel");
/////////////////////////////////////
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password"); //exceptpassword
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("not authorzied");
    }
  }
});

module.exports = { protect };
