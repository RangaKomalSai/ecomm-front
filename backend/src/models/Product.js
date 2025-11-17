const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  image: [{
    type: String
  }],
  rentalPricePerDay: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  mrp: {
    type: Number
  },
  sizes: [{
    size: {
      type: String,
      required: true
    },
    available: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  gender: {
    type: String,
    enum: ['men', 'women', 'Men', 'Women', 'M', 'W'],
    required: true,
    index: true
  },
  filters: [{
    type: {
      type: String
    },
    value: {
      type: String
    }
  }],
  ownerName: {
    type: String,
    default: 'Vesper Rental'
  },
  isFree: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

