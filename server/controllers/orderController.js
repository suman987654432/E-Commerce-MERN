const Order = require("../models/orderModel");
const User = require("../models/userModel");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware
    const user = await User.findById(userId);

    const orderData = {
      ...req.body,
      userId,
      userName: user.name,
      orderDate: new Date(),
      status: 'Pending'
    };

    const newOrder = await Order.create(orderData);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders"
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching user orders"
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: "Error updating order status"
    });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: "Error updating payment status"
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getUserOrders,
  updateOrderStatus,
  updatePaymentStatus
}; 