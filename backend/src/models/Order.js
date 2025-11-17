const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rentalData: {
    rentalDays: Number,
    startDate: String,
    endDate: String,
    totalPrice: Number,
    selectedSize: String
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  address: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zipcode: String,
    phone: String
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'razorpay'
  },
  razorpay_order_id: {
    type: String
  },
  razorpay_payment_id: {
    type: String
  },
  razorpay_signature: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);

