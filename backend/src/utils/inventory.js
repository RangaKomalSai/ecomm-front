const Product = require('../models/Product');

/**
 * Decrement inventory for a specific product size
 * @param {String} productId - Product ID
 * @param {String} size - Size to decrement (e.g., "S", "M", "L")
 * @returns {Promise<Product>} Updated product
 */
async function decrementInventoryForSize(productId, size) {
  try {
    // Get the product from database
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }
    
    // Find the size in the sizes array
    const sizeIndex = product.sizes.findIndex(s => s.size === size);
    
    if (sizeIndex === -1) {
      throw new Error(`Size ${size} not found for product ${productId}`);
    }
    
    // Check if size is available
    if (!product.sizes[sizeIndex].available) {
      throw new Error(`Size ${size} is already out of stock for product ${productId}`);
    }
    
    // Decrement the inventory
    if (product.sizes[sizeIndex].quantity !== undefined && product.sizes[sizeIndex].quantity > 0) {
      // If tracking quantity, decrement it
      product.sizes[sizeIndex].quantity -= 1;
      product.sizes[sizeIndex].available = product.sizes[sizeIndex].quantity > 0;
    } else {
      // If just tracking availability (boolean), mark as unavailable
      product.sizes[sizeIndex].available = false;
    }
    
    // Save the updated product
    await product.save();
    
    console.log(`✓ Inventory decremented: Product ${productId}, Size ${size}`);
    
    return product;
  } catch (error) {
    console.error('Error decrementing inventory:', error);
    throw error;
  }
}

/**
 * Check if inventory is available for items before order creation
 * @param {Array} items - Array of order items with itemId and rentalData
 * @returns {Promise<Boolean>} True if all items are available
 */
async function checkInventoryAvailability(items) {
  for (const item of items) {
    const { itemId, rentalData } = item;
    const { selectedSize } = rentalData;
    
    if (!selectedSize) {
      throw new Error(`No size selected for item ${itemId}`);
    }
    
    const product = await Product.findById(itemId);
    if (!product) {
      throw new Error(`Product ${itemId} not found`);
    }
    
    const sizeOption = product.sizes.find(s => s.size === selectedSize);
    if (!sizeOption || !sizeOption.available) {
      throw new Error(`Size ${selectedSize} is not available for ${product.name}`);
    }
  }
  
  return true;
}

/**
 * Decrement inventory for multiple items (used when order is confirmed)
 * @param {Array} items - Array of order items with itemId and rentalData
 * @returns {Promise<Array>} Array of updated products
 */
async function decrementInventoryForOrder(items) {
  const updatedProducts = [];
  
  for (const item of items) {
    const { itemId, rentalData } = item;
    const { selectedSize } = rentalData;
    
    if (selectedSize) {
      const updatedProduct = await decrementInventoryForSize(itemId, selectedSize);
      updatedProducts.push(updatedProduct);
    }
  }
  
  return updatedProducts;
}

module.exports = {
  decrementInventoryForSize,
  checkInventoryAvailability,
  decrementInventoryForOrder
};

