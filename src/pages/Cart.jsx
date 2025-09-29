import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import PricingDisplay from '../components/PricingDisplay'
import SubscriptionBadge from '../components/SubscriptionBadge'
import UpgradeBanner from '../components/UpgradeBanner'

const Cart = () => {

  const { cartItems, getCartAmount, removeFromCart, updateRentalData, backendUrl, token, currency, userType, subscriptionBenefits } = useContext(ShopContext)
  const [cartData, setCartData] = useState({})
  const [products, setProducts] = useState([])
  const [isNavigating, setIsNavigating] = useState(false)
  const [cartTotal, setCartTotal] = useState({})
  const [forceUpdate, setForceUpdate] = useState(0)
  const navigate = useNavigate()

  // Use local cartItems for non-logged-in users, backend cartData for logged-in users
  const displayCartData = token ? cartData : cartItems

  const loadCartData = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
      if (response.data.success) {
        setCartData(response.data.cartData)
        // Store cart total and user type for display
        if (response.data.cartTotal) {
          setCartTotal(response.data.cartTotal)
        }
        if (response.data.userType) {
          setUserType(response.data.userType)
        }
      }
    } catch (error) {
      // Error loading cart data
    }
  }

  const loadProducts = async () => {
    try {
      const headers = token ? { token } : {};
      const response = await axios.get(backendUrl + '/api/product/list', { headers })
      if (response.data.success) {
        setProducts(response.data.products)
      }
    } catch (error) {
      // Error loading products
    }
  }

  useEffect(() => {
    if (token) {
      loadCartData()
      loadProducts()
    } else {
      // For non-logged-in users, just load products
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
      // Get the itemId from the cart data
      const itemId = displayCartData[itemKey]?.itemId
      if (!itemId) {
        toast.error('Item not found')
        return
      }

      // Remove from local cart
      removeFromCart(itemId)
      
      // If logged in, also remove from backend
      if (token) {
        await axios.post(backendUrl + '/api/cart/remove', { itemId }, { headers: { token } })
        // Update local cartData state immediately
        setCartData(prev => {
          const newCartData = { ...prev }
          delete newCartData[itemKey]
          return newCartData
        })
      }
      
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const handleUpdateRentalData = async (itemId, newRentalData) => {
    try {
      // Update local cart
      updateRentalData(itemId, newRentalData)
      
      // If logged in, also update backend
      if (token) {
        await axios.post(backendUrl + '/api/cart/update', { itemId, rentalData: newRentalData }, { headers: { token } })
        
        // Update local cartData state immediately
        setCartData(prev => ({
          ...prev,
          [itemId]: {
            ...prev[itemId],
            rentalData: newRentalData
          }
        }))
        
        // Force re-render to update calculations
        setForceUpdate(prev => prev + 1)
        
        // Reload cart data to get updated pricing from backend
        const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
        if (response.data.success) {
          setCartData(response.data.cartData)
          if (response.data.cartTotal) {
            setCartTotal(response.data.cartTotal)
          }
        }
      } else {
        // For non-logged-in users, force re-render
        setForceUpdate(prev => prev + 1)
      }
      
      toast.success('Rental details updated')
    } catch (error) {
      toast.error('Failed to update rental details')
    }
  }

  const getProductDetails = (itemId) => {
    return products.find(product => product._id === itemId)
  }

  const calculateTotal = () => {
    let total = 0
    for (const itemKey in displayCartData) {
      if (displayCartData[itemKey] && displayCartData[itemKey].rentalData) {
        const product = getProductDetails(displayCartData[itemKey].itemId)
        const rentalDays = displayCartData[itemKey].rentalData.rentalDays || 1
        
        if (product) {
          // Use the subscription-adjusted price
          const currentPricePerDay = product.rentalPricePerDay || 0
          total += currentPricePerDay * rentalDays
        }
      }
    }
    return total
  }

  const calculateSubtotal = () => {
    let total = 0
    for (const itemKey in displayCartData) {
      if (displayCartData[itemKey] && displayCartData[itemKey].rentalData) {
        const product = getProductDetails(displayCartData[itemKey].itemId)
        const rentalDays = displayCartData[itemKey].rentalData.rentalDays || 1
        
        if (product) {
          // Subtotal should be original rental price * rental days (before subscription benefits)
          const originalPricePerDay = product.originalPrice || product.rentalPricePerDay || 0
          total += originalPricePerDay * rentalDays
        }
      }
    }
    return total
  }

  const calculateDiscount = () => {
    let discount = 0
    for (const itemKey in displayCartData) {
      if (displayCartData[itemKey] && displayCartData[itemKey].rentalData) {
        const product = getProductDetails(displayCartData[itemKey].itemId)
        const rentalDays = displayCartData[itemKey].rentalData.rentalDays || 1
        
        if (product) {
          // Get the original price (before subscription benefits)
          const originalPricePerDay = product.originalPrice || product.rentalPricePerDay || 0
          const currentPricePerDay = product.rentalPricePerDay || 0
          
          // Calculate discount based on subscription benefits
          if (product.isFree) {
            // For free items, discount is the full original price
            discount += originalPricePerDay * rentalDays
          } else if (originalPricePerDay > currentPricePerDay) {
            // For discounted items, discount is the difference
            discount += (originalPricePerDay - currentPricePerDay) * rentalDays
          }
        }
      }
    }
    return discount
  }

  const handleCheckout = async () => {
    if (Object.keys(displayCartData).length === 0) {
      toast.error('Your cart is empty')
      return
    }
    
    // Check if user is logged in
    if (!token) {
      toast.info('Please login to proceed with checkout')
      navigate('/login')
      return
    }
    
    setIsNavigating(true)
    
    try {
      // First, ensure all local cart changes are saved to backend
      for (const itemKey in displayCartData) {
        if (displayCartData[itemKey] && displayCartData[itemKey].rentalData) {
          await axios.post(backendUrl + '/api/cart/update', { 
            itemId: displayCartData[itemKey].itemId, 
            rentalData: displayCartData[itemKey].rentalData 
          }, { headers: { token } })
        }
      }
      
      // Then fetch the updated cart data from backend
      const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
      if (response.data.success) {
        // Update local cart data with latest from backend
        setCartData(response.data.cartData)
        if (response.data.cartTotal) {
          setCartTotal(response.data.cartTotal)
        }
        // Cart data is saved and synchronized, proceed to checkout
        navigate('/place-order', { 
          state: { 
            cartData: response.data.cartData, 
            cartTotal: response.data.cartTotal 
          } 
        })
      } else {
        toast.error('Failed to load cart data')
        setIsNavigating(false)
      }
    } catch (error) {
      toast.error('Failed to sync cart data')
      setIsNavigating(false)
    }
  }

  return (
    <div className='border-t border-[#e8dccf] pt-16 bg-[#fdf7f0] text-[#3d2b1f]'>
      <div className='text-2xl mb-8'>
        <h1 className='font-bold text-[#3d2b1f]'>SHOPPING CART</h1>
      </div>

      {Object.keys(displayCartData).length === 0 ? (
        <div className='text-center py-16'>
          <img src={assets.cart_icon} alt="" className='w-32 mx-auto mb-4 opacity-50' draggable={false} />
          <h2 className='text-xl font-medium mb-2 text-[#3d2b1f]'>Your cart is empty</h2>
          <p className='text-[#3d2b1f] opacity-60 mb-6'>Add some rental items to get started</p>
          <button 
            onClick={() => navigate('/collection')}
            className='bg-[#3d2b1f] text-[#fdf7f0] px-6 py-3 rounded hover:bg-[#5a3c2c] transition-colors'
          >
            Browse Collection
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-2'>
            {Object.entries(displayCartData).map(([itemKey, item]) => {
              const product = getProductDetails(item.itemId)
              if (!product) return null

              return (
                <div key={itemKey} className='border-b pb-6 mb-6'>
                  <div className='flex gap-4'>
                    <img 
                      src={product.image[0]} 
                      alt={product.name}
                      className='w-24 h-24 object-cover rounded'
                      draggable={false}
                    />
                    <div className='flex-1'>
                      <h3 className='font-medium text-lg'>{product.name}</h3>
                      <p className='text-gray-600 text-sm'>
                        {product.filters?.find(f => f.type === 'category')?.value || 'General'} - {product.filters?.find(f => f.type === 'subCategory')?.value || 'Rental Item'}
                      </p>
                      
                      {/* Subscription Pricing Display */}
                      <div className='mt-2'>
                        <PricingDisplay 
                          product={product}
                          size="normal"
                          showOriginalPrice={true}
                          showSubscriptionBadge={true}
                        />
                      </div>
                      
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
                            value={item.rentalData.rentalDays || (() => {
                              // Calculate rental days from dates if not stored
                              const start = new Date(item.rentalData.startDate)
                              const end = new Date(item.rentalData.endDate)
                              return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
                            })()}
                            onChange={(e) => {
                              const newRentalDays = parseInt(e.target.value)
                              const startDate = new Date(item.rentalData.startDate)
                              const endDate = new Date(startDate.getTime() + (newRentalDays - 1) * 24 * 60 * 60 * 1000)
                              
                              // Get the current product pricing (considering subscription benefits)
                              const currentProduct = item.product || product
                              const pricePerDay = currentProduct.rentalPricePerDay || product.rentalPricePerDay
                              
                              const newRentalData = {
                                ...item.rentalData,
                                rentalDays: newRentalDays,
                                endDate: endDate.toISOString().split('T')[0],
                                totalPrice: pricePerDay * newRentalDays
                              }
                              
                              // Update local state immediately for real-time updates
                              if (token) {
                                setCartData(prev => ({
                                  ...prev,
                                  [item.itemId]: {
                                    ...prev[item.itemId],
                                    rentalData: newRentalData
                                  }
                                }))
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
                              const rentalDays = item.rentalData.rentalDays || 1
                              const endDate = new Date(new Date(startDate).getTime() + ((rentalDays - 1) * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
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
                        <div className='flex items-center gap-2'>
                          <p className='text-lg font-medium'>
                            {item.product && item.product.isFree ? 'Free' : `${currency}${item.rentalData.totalPrice || 0}`}
                          </p>
                          {item.product && item.product.isFree && item.product.mrp && (
                            <span className='text-sm text-gray-400 line-through'>
                              {currency}{item.product.mrp}
                            </span>
                          )}
                        </div>
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
              
              {/* Login reminder for non-logged-in users */}
              {!token && (
                <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='text-blue-600 font-medium text-sm'>💡 Guest Shopping</span>
                  </div>
                  <div className='text-xs text-blue-700 mt-1'>
                    You can add items to cart without logging in. Login is required only at checkout.
                  </div>
                </div>
              )}
              
              {/* Subscription Benefits Display */}
              {userType !== 'free' && (
                <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
                  <div className='flex items-center gap-2 mb-2'>
                    <SubscriptionBadge userType={userType} size="small" />
                  </div>
                  <div className='text-xs text-green-700'>
                    {userType === 'plus' 
                      ? 'Premium products free, Royal products 50% off'
                      : 'All products free'
                    }
                  </div>
                </div>
              )}

              {/* Upgrade Banner for Free Users */}
              {userType === 'free' && Object.keys(displayCartData).length > 0 && (
                <div className='mb-4'>
                  <UpgradeBanner 
                    product={Object.values(displayCartData)[0]?.product}
                    showSavings={true}
                    compact={true}
                  />
                </div>
              )}
              
              <div className='space-y-2 mb-4'>
                <div className='flex justify-between'>
                  <span>Subtotal:</span>
                  <span>{currency}{calculateSubtotal()}</span>
                </div>
                {calculateDiscount() > 0 && (
                  <div className='flex justify-between text-green-600'>
                    <span>Discount ({userType === 'plus' ? 'Plus' : 'Pro'}):</span>
                    <span>-{currency}{calculateDiscount()}</span>
                  </div>
                )}
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
                {isNavigating ? 'Processing...' : token ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
