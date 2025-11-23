const express = require('express')
require('dotenv').config();
const app = express();
const path = require('path')
const adminRoute = require("./routes/adminRoute");
const productRoute = require("./routes/productRoute")
const authRoute = require('./routes/authRoute');
const orderRoute = require('./routes/orderRoute');
const userRoute = require('./routes/userRoute');
const cors = require('cors')
const db = require('./db') //used to connect the database with database file

db() //used to connect the database with database file

// Enable CORS first
app.use(cors());

// Then body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add logging middleware for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
    }
    // Special logging for order routes
    if (req.path.includes('/order')) {
        console.log('ORDER ROUTE - Full request details:', {
            method: req.method,
            path: req.path,
            headers: req.headers,
            body: req.body,
            query: req.query,
            params: req.params
        });
    }
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/admin", adminRoute);
app.use("/product", productRoute);
app.use('/auth', authRoute);
app.use('/order', orderRoute);
app.use('/user', userRoute);

// Add a simple test endpoint to verify routes are working
app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        availableRoutes: [
            'GET /order - Get all orders',
            'POST /order/create - Create order',
            'GET /order/user/:userId - Get user orders (if exists)',
            'GET /user/profile/:userId - Get user profile (if exists)'
        ]
    });
});

// Add a debug endpoint to check what's in the orders collection
app.get('/debug/orders', async (req, res) => {
    try {
        // This assumes you're using mongoose, adjust if using different ODM
        const mongoose = require('mongoose');
        
        if (mongoose.models.Order) {
            const Order = mongoose.models.Order;
            const orders = await Order.find().limit(5); // Get first 5 orders for debugging
            
            res.json({
                success: true,
                totalOrders: await Order.countDocuments(),
                sampleOrders: orders.map(order => ({
                    _id: order._id,
                    userId: order.userId || order.user,
                    fullName: order.fullName,
                    email: order.email,
                    createdAt: order.createdAt
                })),
                message: 'Sample orders from database'
            });
        } else {
            res.json({
                success: false,
                message: 'Order model not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
});

// Add endpoint to list all available routes (for debugging)
app.get('/debug/routes', (req, res) => {
    const routes = [];
    
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            routes.push({
                path: middleware.route.path,
                methods: Object.keys(middleware.route.methods)
            });
        } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    routes.push({
                        path: handler.route.path,
                        methods: Object.keys(handler.route.methods)
                    });
                }
            });
        }
    });
    
    res.json({
        success: true,
        routes: routes,
        message: 'Available routes'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const port = process.env.PORT
app.listen(port, function () {
    console.log(`server listening on port ${port}`)
})