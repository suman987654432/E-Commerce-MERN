const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Import user model
const Order = require('../models/orderModel'); // Import order model

// In-memory orders storage (temporary until Order model is ready)
let orders = [];

// Get user profile with real data
router.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching profile for userId:', userId);
        
        // Try to get user from database first
        let user = null;
        try {
            if (User) {
                user = await User.findById(userId).select('-password');
                console.log('User found in database:', user);
            }
        } catch (dbError) {
            console.log('Database user fetch error, using fallback:', dbError.message);
        }
        
        // If no user found in DB, get from localStorage/session data
        if (!user) {
            // Return user data structure that matches frontend expectations
            user = {
                _id: userId,
                name: 'User', // This will be replaced by actual login data
                email: 'user@example.com',
                phone: 'Not provided',
                address: 'Not provided'
            };
        }
        
        // Get user orders (both from memory and database)
        let userOrders = [];
        try {
            if (Order) {
                userOrders = await Order.find({ userId: userId });
                console.log('Orders found in database:', userOrders.length);
            }
        } catch (dbError) {
            console.log('Database order fetch error, using memory storage:', dbError.message);
        }
        
        // Add in-memory orders as fallback
        const memoryOrders = orders.filter(order => order.userId === userId);
        userOrders = [...userOrders, ...memoryOrders];
        
        console.log('Returning user:', user);
        console.log('Returning orders:', userOrders.length);
        
        res.json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone || 'Not provided',
                address: user.address || 'Not provided'
            },
            orders: userOrders
        });
        
    } catch (error) {
        console.error('Error in profile route:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, phone, address } = req.body;
        
        let updatedUser = null;
        try {
            if (User) {
                updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { name, email, phone, address },
                    { new: true, select: '-password' }
                );
            }
        } catch (dbError) {
            console.log('Database update error:', dbError.message);
        }
        
        res.json({
            success: true,
            user: updatedUser || { _id: userId, name, email, phone, address },
            message: 'Profile updated successfully'
        });
        
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
