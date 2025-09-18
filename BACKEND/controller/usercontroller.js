const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/usermodel");
const { off } = require("../model/usermodel");

const registeruser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  if (!email || !name || !password) {
    res.status(400);
    throw new Error("please add all fields");
  }

  const userexists = await User.findOne({ email });
  console.log(userexists);
  if (userexists) {
    res.status(400);
    throw new Error("user already exists");
  }
  const salts = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salts);

  const user = await User.create({
    name,
    email,
    password: hashedpassword,
  });

  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generatejwt(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

const loginuser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      Loggedin: true,
      token: generatejwt(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});
const generatejwt = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
};
const fetchuser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

module.exports = { registeruser, loginuser, fetchuser };
