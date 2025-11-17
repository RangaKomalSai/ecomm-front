const Order = require('../models/Order');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { decrementInventoryForOrder, checkInventoryAvailability } = require('../utils/inventory');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create Razorpay order
 * POST /api/order/razorpay
 */
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    
    // Validate input
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.json({
        success: false,
        message: 'Invalid order data'
      });
    }
    
    // Check inventory availability before creating order
    try {
      await checkInventoryAvailability(items);
    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      if (item.rentalData && item.rentalData.totalPrice) {
        totalAmount += item.rentalData.totalPrice;
      }
    }
    totalAmount += 10; // Add delivery fee
    
    // Create order in database (pending status)
    const order = new Order({
      userId,
      items,
      address,
      totalAmount,
      status: 'pending'
    });
    await order.save();
    
    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${order._id}`,
      notes: {
        orderId: order._id.toString(),
        userId: userId.toString()
      }
    });
    
    // Update order with Razorpay order ID
    order.razorpay_order_id = razorpayOrder.id;
    await order.save();
    
    return res.json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      },
      orderId: order._id
    });
    
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
};

/**
 * Verify Razorpay payment and update inventory
 * POST /api/order/verifyRazorpay
 */
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { userId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.json({
        success: false,
        message: 'Missing payment verification data'
      });
    }
    
    // Verify Razorpay signature
    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');
    
    if (generatedSignature !== razorpay_signature) {
      return res.json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
    
    // Find the order
    const order = await Order.findOne({ razorpay_order_id });
    
    if (!order) {
      return res.json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order is already confirmed
    if (order.status === 'confirmed') {
      return res.json({
        success: true,
        message: 'Order already confirmed',
        order: order
      });
    }
    
    // DECREMENT INVENTORY FOR EACH ITEM
    try {
      await decrementInventoryForOrder(order.items);
      console.log(`✓ Inventory decremented for order ${order._id}`);
    } catch (error) {
      console.error('Error decrementing inventory:', error);
      // Even if inventory decrement fails, we should still mark payment as verified
      // You may want to handle this differently based on your business logic
      return res.json({
        success: false,
        message: `Payment verified but inventory update failed: ${error.message}`
      });
    }
    
    // Update order status
    order.status = 'confirmed';
    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;
    await order.save();
    
    return res.json({
      success: true,
      message: 'Payment verified and inventory updated',
      order: order
    });
    
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed'
    });
  }
};

/**
 * Get user orders
 * POST /api/order/userorders
 */
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const token = req.headers.token;
    
    // You should verify the token and get userId from it
    // For now, using userId from body
    
    const orders = await Order.find({ userId })
      .populate('items.itemId')
      .sort({ createdAt: -1 });
    
    return res.json({
      success: true,
      orders: orders
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders'
    });
  }
};

