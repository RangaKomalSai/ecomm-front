const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products (with optional gender filter)
router.get('/list', productController.getProducts);

// Get single product
router.get('/:id', productController.getProduct);

module.exports = router;

