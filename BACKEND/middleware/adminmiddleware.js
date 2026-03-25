const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next();
  res.status(403);
  throw new Error("Access denied: Admins only");
};

module.exports = { adminOnly };
