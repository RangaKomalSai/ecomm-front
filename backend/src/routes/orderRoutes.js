const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create Razorpay order
router.post('/razorpay', orderController.createRazorpayOrder);

// Verify Razorpay payment and decrement inventory
router.post('/verifyRazorpay', orderController.verifyRazorpayPayment);

// Get user orders
router.post('/userorders', orderController.getUserOrders);

module.exports = router;

