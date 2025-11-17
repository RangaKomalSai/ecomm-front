const Product = require('../models/Product');

/**
 * Get all products with optional gender filter
 * GET /api/product/list
 */
exports.getProducts = async (req, res) => {
  try {
    const { gender } = req.query;
    const token = req.headers.token;
    
    // Build query
    const query = {};
    
    // Filter by gender if provided
    if (gender) {
      // Support multiple gender formats
      const genderLower = gender.toLowerCase();
      query.$or = [
        { gender: genderLower },
        { gender: genderLower.charAt(0).toUpperCase() + genderLower.slice(1) },
        { gender: genderLower === 'men' ? 'M' : genderLower === 'women' ? 'W' : genderLower },
        // Also check in filters array for backward compatibility
        { 'filters.type': 'gender', 'filters.value': { $in: [genderLower, genderLower.charAt(0).toUpperCase() + genderLower.slice(1)] } }
      ];
    }
    
    // Get all products
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    // Build filter options from products
    const filterOptions = {};
    products.forEach(product => {
      if (product.filters && Array.isArray(product.filters)) {
        product.filters.forEach(filter => {
          if (filter.type && filter.value) {
            if (!filterOptions[filter.type]) {
              filterOptions[filter.type] = [];
            }
            if (!filterOptions[filter.type].includes(filter.value)) {
              filterOptions[filter.type].push(filter.value);
            }
          }
        });
      }
    });
    
    return res.json({
      success: true,
      products: products,
      filterOptions: filterOptions
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch products'
    });
  }
};

/**
 * Get single product by ID
 * GET /api/product/:id
 */
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    return res.json({
      success: true,
      product: product
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch product'
    });
  }
};

