const express = require('express');
const router = express.Router();
const { signup, login, getAllUsers, deleteUser } = require('../controllers/authController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const { adminLogin } = require('../controllers/adminController');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Admin routes - protected
router.get('/users', authenticateToken, isAdmin, getAllUsers);
router.delete('/users/:id', authenticateToken, isAdmin, deleteUser);

// Admin login route
router.post('/admin/login', adminLogin);

module.exports = router; 