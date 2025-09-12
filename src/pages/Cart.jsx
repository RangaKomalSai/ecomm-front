import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'

const Cart = () => {

  const { cartItems, getCartAmount, removeFromCart, updateRentalData, backendUrl, token, currency } = useContext(ShopContext)
  const [cartData, setCartData] = useState({})
  const [products, setProducts] = useState([])
  const [isNavigating, setIsNavigating] = useState(false)
  const navigate = useNavigate()

  const loadCartData = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
      if (response.data.success) {
        setCartData(response.data.cartData)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const loadProducts = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setProducts(response.data.products)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (token) {
      loadCartData()
      loadProducts()
    }
  }, [token])

  // Refresh cart data when component mounts (e.g., returning from place order)
  useEffect(() => {
    if (token) {
      loadCartData()
    }
  }, [])

  const handleRemoveItem = async (itemKey) => {
    try {
      await axios.post(backendUrl + '/api/cart/remove', { itemKey }, { headers: { token } })
      removeFromCart(itemKey)
      
      // Update local cartData state immediately
      setCartData(prev => {
        const newCartData = { ...prev }
        delete newCartData[itemKey]
        return newCartData
      })
      
      toast.success('Item removed from cart')
    } catch (error) {
      console.log(error)
      toast.error('Failed to remove item')
    }
  }

  const handleUpdateRentalData = async (itemId, newRentalData) => {
    try {
      await axios.post(backendUrl + '/api/cart/update', { itemId, rentalData: newRentalData }, { headers: { token } })
      updateRentalData(itemId, newRentalData)
      
      // Update local cartData state immediately
      setCartData(prev => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          rentalData: newRentalData
        }
      }))
      
      toast.success('Rental details updated')
    } catch (error) {
      console.log(error)
      toast.error('Failed to update rental details')
    }
  }

  const getProductDetails = (itemId) => {
    return products.find(product => product._id === itemId)
  }

  const calculateTotal = () => {
    let total = 0
    for (const itemKey in cartData) {
      if (cartData[itemKey] && cartData[itemKey].rentalData) {
        total += cartData[itemKey].rentalData.totalPrice
      }
    }
    return total
  }

  const handleCheckout = () => {
    if (Object.keys(cartData).length === 0) {
      toast.error('Your cart is empty')
      return
    }
    
    setIsNavigating(true)
    // Add a small delay for smooth transition
    setTimeout(() => {
      navigate('/place-order')
    }, 300)
  }

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <h1 className='font-bold'>SHOPPING CART</h1>
      </div>

      {Object.keys(cartData).length === 0 ? (
        <div className='text-center py-16'>
          <img src={assets.cart_icon} alt="" className='w-32 mx-auto mb-4 opacity-50' />
          <h2 className='text-xl font-medium mb-2'>Your cart is empty</h2>
          <p className='text-gray-500 mb-6'>Add some rental items to get started</p>
          <button 
            onClick={() => navigate('/collection')}
            className='bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors'
          >
            Browse Collection
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-2'>
            {Object.entries(cartData).map(([itemKey, item]) => {
              const product = getProductDetails(item.itemId)
              if (!product) return null

              return (
                <div key={itemKey} className='border-b pb-6 mb-6'>
                  <div className='flex gap-4'>
                    <img 
                      src={product.image[0]} 
                      alt={product.name}
                      className='w-24 h-24 object-cover rounded'
                    />
                    <div className='flex-1'>
                      <h3 className='font-medium text-lg'>{product.name}</h3>
                      <p className='text-gray-600 text-sm'>{product.category} - {product.subCategory}</p>
                      
                      {/* Rental Details */}
                      <div className='mt-3 space-y-2'>
                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                          <div className='flex items-center gap-4'>
                            <label className='text-sm font-medium'>Size:</label>
                            <select 
                              value={item.rentalData.selectedSize || ''}
                              onChange={(e) => {
                                const newRentalData = {
                                  ...item.rentalData,
                                  selectedSize: e.target.value
                                }
                                handleUpdateRentalData(item.itemId, newRentalData)
                              }}
                              className='border px-2 py-1 rounded text-sm'
                            >
                              <option value="">Select Size</option>
                              {product.sizes.map((sizeOption, index) => (
                                <option 
                                  key={index} 
                                  value={sizeOption.size}
                                  disabled={!sizeOption.available}
                                >
                                  {sizeOption.size} {!sizeOption.available ? '(Out of Stock)' : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className='flex items-center gap-4'>
                          <label className='text-sm font-medium'>Rental Duration:</label>
                          <select 
                            value={item.rentalData.rentalDays}
                            onChange={(e) => {
                              const newRentalData = {
                                ...item.rentalData,
                                rentalDays: parseInt(e.target.value),
                                totalPrice: product.rentalPricePerDay * parseInt(e.target.value)
                              }
                              handleUpdateRentalData(item.itemId, newRentalData)
                            }}
                            className='border px-2 py-1 rounded text-sm'
                          >
                            {[...Array(14)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1} day{i + 1 > 1 ? 's' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className='flex items-center gap-4'>
                          <label className='text-sm font-medium'>Start Date:</label>
                          <input 
                            type="date"
                            value={item.rentalData.startDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => {
                              const startDate = e.target.value
                              const endDate = new Date(new Date(startDate).getTime() + (item.rentalData.rentalDays * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
                              const newRentalData = {
                                ...item.rentalData,
                                startDate,
                                endDate
                              }
                              handleUpdateRentalData(item.itemId, newRentalData)
                            }}
                            className='border px-2 py-1 rounded text-sm'
                          />
                        </div>

                        <div className='flex items-center gap-4'>
                          <label className='text-sm font-medium'>Return Date:</label>
                          <span className='text-sm text-gray-600'>{item.rentalData.endDate}</span>
                        </div>
                      </div>

                      <div className='flex justify-between items-center mt-4'>
                        <p className='text-lg font-medium'>{currency}{item.rentalData.totalPrice}</p>
                        <button 
                          onClick={() => handleRemoveItem(itemKey)}
                          className='text-red-500 hover:text-red-700 text-sm'
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-gray-50 p-6 rounded-lg sticky top-4'>
              <h3 className='text-lg font-medium mb-4'>Order Summary</h3>
              
              <div className='space-y-2 mb-4'>
                <div className='flex justify-between'>
                  <span>Subtotal:</span>
                  <span>{currency}{calculateTotal()}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Delivery:</span>
                  <span>{currency}10</span>
                </div>
                <hr />
                <div className='flex justify-between font-medium text-lg'>
                  <span>Total:</span>
                  <span>{currency}{calculateTotal() + 10}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isNavigating}
                className={`w-full py-3 rounded transition-all duration-300 ${
                  isNavigating 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isNavigating ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
