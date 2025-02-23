const express = require("express");
const router = express.Router();
const {
    createOrder,
    getOrders,
    getUserOrders,
    updateOrderStatus,
    updatePaymentStatus
} = require("../controllers/orderController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// Apply authenticateToken to all routes
router.use(authenticateToken);

// Admin routes
router.get("/", isAdmin, getOrders);
router.put("/:id/status", isAdmin, updateOrderStatus);
router.put("/:id/payment-status", isAdmin, updatePaymentStatus);

// User routes
router.post("/create", createOrder);
router.get("/user", getUserOrders);

module.exports = router; 