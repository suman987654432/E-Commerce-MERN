const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/orderModel');

// Add this debug log
console.log('Razorpay Config:', {
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY?.substring(0, 5) + '...' // Log partial key for security
});

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order: order
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const saveOrder = async (req, res) => {
    try {
        const orderData = {
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const newOrder = await Order.create(orderData);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: newOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            res.json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            res.json({
                success: false,
                message: "Payment verification failed"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const handlePaymentFailure = async (req, res) => {
    try {
        const { orderId, error } = req.body;

        if (orderId) {
            await Order.findByIdAndUpdate(orderId, {
                status: 'payment_failed',
                paymentDetails: {
                    error: error || 'Payment failed',
                    timestamp: new Date()
                }
            });
        }

        res.json({
            message: 'Payment failure recorded',
            status: 'payment_failed'
        });
    } catch (error) {
        console.error('Error handling payment failure:', error);
        res.status(500).json({
            error: 'Error handling payment failure',
            details: error.message
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    handlePaymentFailure,
    saveOrder
}; 