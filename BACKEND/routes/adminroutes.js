const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authmiddleware");
const { adminOnly } = require("../middleware/adminmiddleware");
const {
  getStats, getAllOrders, updateOrderStatus,
  getAllUsers, toggleAdminRole,
  getAllProducts, createProduct, updateProduct, deleteProduct,
} = require("../controller/admincontroller");

const guard = [protect, adminOnly];

router.get("/stats",              ...guard, getStats);
router.get("/orders",             ...guard, getAllOrders);
router.put("/orders/:id/status",  ...guard, updateOrderStatus);
router.get("/users",              ...guard, getAllUsers);
router.put("/users/:id/role",     ...guard, toggleAdminRole);
router.get("/products",           ...guard, getAllProducts);
router.post("/products",          ...guard, createProduct);
router.put("/products/:id",       ...guard, updateProduct);
router.delete("/products/:id",    ...guard, deleteProduct);

module.exports = router;
