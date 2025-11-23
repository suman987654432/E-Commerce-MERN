const express = require('express');
const router = express.Router();

// In-memory orders storage
let orders = [];
let orderIdCounter = 1;

// Create new order
router.post('/create', (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            address,
            city,
            state,
            pincode,
            items,
            amount,
            paymentMethod,
            userId
        } = req.body;

        console.log('Creating order with data:', req.body);

        const newOrder = {
            _id: orderIdCounter.toString(),
            fullName,
            email,
            phone,
            address,
            city,
            state,
            pincode,
            items,
            amount,
            paymentMethod,
            userId: userId, // Use actual userId from request
            status: 'Pending',
            paymentStatus: 'Pending',
            createdAt: new Date()
        };

        orders.push(newOrder);
        orderIdCounter++;

        console.log('Order created successfully:', newOrder._id);
        console.log('Total orders:', orders.length);
        console.log('Order stored with userId:', newOrder.userId);

        res.json({
            success: true,
            message: 'Order placed successfully',
            orderId: newOrder._id,
            order: newOrder
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
});

// Get all orders (for admin)
router.get('/', (req, res) => {
    try {
        console.log('Fetching all orders. Count:', orders.length);
        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Update order status
router.put('/:orderId/status', (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        const orderIndex = orders.findIndex(order => order._id === orderId);
        
        if (orderIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        orders[orderIndex].status = status;
        
        res.json({
            success: true,
            order: orders[orderIndex]
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Update payment status
router.put('/:orderId/payment-status', (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        const orderIndex = orders.findIndex(order => order._id === orderId);
        
        if (orderIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        orders[orderIndex].paymentStatus = status;
        
        res.json({
            success: true,
            order: orders[orderIndex]
        });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;