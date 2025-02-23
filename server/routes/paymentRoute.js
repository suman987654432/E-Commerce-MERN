const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, saveOrder } = require('../controllers/paymentController');

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.post('/order', saveOrder);

module.exports = router; 