const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/usermodel");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RULES = [
  { test: (p) => p.length >= 8, msg: "Password must be at least 8 characters" },
  { test: (p) => /[A-Z]/.test(p), msg: "Password must contain an uppercase letter" },
  { test: (p) => /[a-z]/.test(p), msg: "Password must contain a lowercase letter" },
  { test: (p) => /[0-9]/.test(p), msg: "Password must contain a number" },
  { test: (p) => /[^A-Za-z0-9]/.test(p), msg: "Password must contain a special character" },
];

const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const registeruser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  if (!EMAIL_REGEX.test(email)) {
    res.status(400);
    throw new Error("Invalid email address");
  }

  for (const rule of PASSWORD_RULES) {
    if (!rule.test(password)) {
      res.status(400);
      throw new Error(rule.msg);
    }
  }

  const userexists = await User.findOne({ email });
  if (userexists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salts = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salts);

  const refreshToken = generateRefreshToken("temp");
  const user = await User.create({ name, email, password: hashedpassword });

  const accessToken = generateAccessToken(user.id);
  const newRefreshToken = generateRefreshToken(user.id);
  await User.findByIdAndUpdate(user.id, { refreshToken: newRefreshToken });

  setRefreshCookie(res, newRefreshToken);

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: accessToken,
  });
});

const loginuser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);
    await User.findByIdAndUpdate(user.id, { refreshToken: newRefreshToken });

    setRefreshCookie(res, newRefreshToken);

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: accessToken,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

const refreshtoken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    res.status(401);
    throw new Error("No refresh token");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    res.status(401);
    throw new Error("Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== token) {
    res.status(401);
    throw new Error("Refresh token mismatch");
  }

  const newAccessToken = generateAccessToken(user.id);
  const newRefreshToken = generateRefreshToken(user.id);
  await User.findByIdAndUpdate(user.id, { refreshToken: newRefreshToken });
  setRefreshCookie(res, newRefreshToken);

  res.json({ token: newAccessToken });
});

const logoutuser = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    const decoded = jwt.decode(token);
    if (decoded?.id) {
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    }
  }
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

const fetchuser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update name
  if (name) user.name = name.trim();

  // Update email
  if (email && email !== user.email) {
    if (!EMAIL_REGEX.test(email)) {
      res.status(400);
      throw new Error("Invalid email address");
    }
    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      res.status(400);
      throw new Error("Email already in use");
    }
    user.email = email;
  }

  // Change password
  if (newPassword) {
    if (!currentPassword) {
      res.status(400);
      throw new Error("Current password is required");
    }
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      res.status(400);
      throw new Error("Current password is incorrect");
    }
    for (const rule of PASSWORD_RULES) {
      if (!rule.test(newPassword)) {
        res.status(400);
        throw new Error(rule.msg);
      }
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  }

  await user.save();

  res.json({
    _id: user.id,
    name: user.name,
    email: user.email,
    token: req.headers.authorization.split(" ")[1],
  });
});

module.exports = { registeruser, loginuser, refreshtoken, logoutuser, fetchuser, updateProfile };
