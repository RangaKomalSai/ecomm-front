import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import axios from 'axios'

const PlaceOrder = () => {

  const { cartItems, getCartAmount, backendUrl, token, currency, userId, userType } = useContext(ShopContext)
  const [cartData, setCartData] = useState({})
  const [cartTotal, setCartTotal] = useState({})
  const [products, setProducts] = useState([])
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    country: 'India',
    zipcode: '',
    phone: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('Razorpay')
  const [isLoading, setIsLoading] = useState(true)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderInProgress, setOrderInProgress] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Indian states list
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ]

  const loadCartData = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
      if (response.data.success) {
        setCartData(response.data.cartData)
        // Store cart total and user type for display
        if (response.data.cartTotal) {
          setCartTotal(response.data.cartTotal)
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
      // Check if cart data was passed from navigation state
      if (location.state && location.state.cartData) {
        setCartData(location.state.cartData)
        if (location.state.cartTotal) {
          setCartTotal(location.state.cartTotal)
        }
        setIsLoading(false)
      } else {
        // Load from backend if no navigation state
        Promise.all([loadCartData(), loadProducts()]).then(() => {
          setIsLoading(false)
        })
      }
    } else {
      navigate('/login')
    }
  }, [token, location.state])

  // Load products regardless of cart data source
  useEffect(() => {
    if (token) {
      loadProducts()
    }
  }, [token])

  const getProductDetails = (itemId) => {
    return products.find(product => product._id === itemId)
  }

  const calculateTotal = () => {
    let total = 0
    // Handle both array and object formats for cartData
    const items = Array.isArray(cartData) ? cartData : Object.values(cartData)
    for (const item of items) {
      if (item && item.rentalData) {
        const product = item.product || getProductDetails(item.itemId)
        const rentalDays = item.rentalData.rentalDays || 1
        
        if (product) {
          // Use the subscription-adjusted price
          const currentPricePerDay = product.rentalPricePerDay || 0
          const itemTotal = currentPricePerDay * rentalDays
          total += itemTotal
        }
      }
    }
    return total + 10 // Add delivery charge
  }

  const calculateSubtotal = () => {
    let total = 0
    // Handle both array and object formats for cartData
    const items = Array.isArray(cartData) ? cartData : Object.values(cartData)
    for (const item of items) {
      if (item && item.rentalData) {
        const product = item.product || getProductDetails(item.itemId)
        const rentalDays = item.rentalData.rentalDays || 1
        
        if (product) {
          // Subtotal should be original rental price * rental days (before subscription benefits)
          const originalPricePerDay = product.originalPrice || product.rentalPricePerDay || 0
          const itemTotal = originalPricePerDay * rentalDays
          total += itemTotal
        }
      }
    }
    return total
  }

  const calculateDiscount = () => {
    let discount = 0
    // Handle both array and object formats for cartData
    const items = Array.isArray(cartData) ? cartData : Object.values(cartData)
    for (const item of items) {
      if (item && item.rentalData) {
        const product = item.product || getProductDetails(item.itemId)
        const rentalDays = item.rentalData.rentalDays || 1
        
        if (product) {
          // Get the original price (before subscription benefits)
          const originalPricePerDay = product.originalPrice || product.rentalPricePerDay || 0
          const currentPricePerDay = product.rentalPricePerDay || 0
          
          // Calculate discount based on subscription benefits
          if (product.isFree) {
            // For free items, discount is the full original price
            const itemDiscount = originalPricePerDay * rentalDays
            discount += itemDiscount
          } else if (originalPricePerDay > currentPricePerDay) {
            // For discounted items, discount is the difference
            const itemDiscount = (originalPricePerDay - currentPricePerDay) * rentalDays
            discount += itemDiscount
          } else if (product.discount && product.discount > 0) {
            // Use the discount field if available
            const itemDiscount = product.discount * rentalDays
            discount += itemDiscount
          }
        }
      }
    }
    return discount
  }

  const handlePlaceOrder = async () => {
    // Prevent multiple simultaneous order attempts
    if (isPlacingOrder || orderInProgress) {
      toast.error('Order is already being processed. Please wait...')
      return
    }

    if (!address.firstName || !address.lastName || !address.street || !address.city || !address.state || !address.country || !address.zipcode || !address.phone) {
      toast.error('Please fill in all address fields')
      return
    }

    // Validate phone number (10 digits)
    if (address.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    // Validate PIN code (6 digits)
    if (address.zipcode.length !== 6) {
      toast.error('Please enter a valid 6-digit PIN code')
      return
    }

    // Handle both array and object formats for cartData
    const items = Array.isArray(cartData) ? cartData : Object.values(cartData)
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    // Check inventory availability before placing order
    for (const item of items) {
      const product = item.product || getProductDetails(item.itemId)
      if (product && product.sizes && item.rentalData?.selectedSize) {
        const sizeOption = product.sizes.find(s => s.size === item.rentalData.selectedSize)
        if (!sizeOption || !sizeOption.available) {
          toast.error(`${product.name} - Size ${item.rentalData.selectedSize} is no longer available. Please remove it from your cart.`)
          setIsPlacingOrder(false)
          setOrderInProgress(false)
          return
        }
      }
    }

    setIsPlacingOrder(true)
    setOrderInProgress(true)
    
    try {
      const orderItems = items.map(item => ({
        itemId: item.itemId,
        rentalData: item.rentalData
      }))

      // Only Razorpay payment
      const response = await axios.post(backendUrl + '/api/order/razorpay', {
        userId: userId,
        items: orderItems,
        address
      }, { headers: { token } })

      if (response.data.success) {
        // Handle Razorpay payment
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: response.data.order.amount,
          currency: response.data.order.currency,
          name: 'Vesper Rental',
          description: 'Rental Order',
          order_id: response.data.order.id,
          handler: function (paymentResponse) {
            verifyPayment(paymentResponse)
          },
          modal: {
            ondismiss: function() {
              // Reset states if user closes payment modal
              setIsPlacingOrder(false)
              setOrderInProgress(false)
            }
          },
          prefill: {
            name: address.firstName + ' ' + address.lastName,
            email: 'user@example.com',
            contact: address.phone
          }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      }
    } catch (error) {
      toast.error('Failed to place order')
      setIsPlacingOrder(false)
      setOrderInProgress(false)
    }
  }

  const verifyPayment = async (paymentResponse) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/verifyRazorpay', {
        userId: userId,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature
      }, { headers: { token } })

      if (response.data.success) {
        toast.success('Payment successful!')
        setIsPlacingOrder(false)
        setOrderInProgress(false)
        navigate('/orders')
      } else {
        toast.error('Payment verification failed')
        setIsPlacingOrder(false)
        setOrderInProgress(false)
      }
    } catch (error) {
      toast.error('Payment verification failed')
      setIsPlacingOrder(false)
      setOrderInProgress(false)
    }
  }

  if (isLoading) {
    return (
      <div className='border-t pt-16 text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4'></div>
        <p className='text-lg'>Loading your order...</p>
      </div>
    )
  }

  // Handle both array and object formats for cartData
  const items = Array.isArray(cartData) ? cartData : Object.values(cartData)
  if (!cartData || items.length === 0) {
    return (
      <div className='border-t pt-16 text-center'>
        <h1 className='text-2xl font-bold mb-4'>Your cart is empty</h1>
        <button 
          onClick={() => navigate('/collection')}
          className='bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors'
        >
          Browse Collection
        </button>
      </div>
    )
  }

  return (
    <div className='border-t border-[#e8dccf] pt-16 bg-[#fdf7f0] text-[#3d2b1f]'>
      <div className='text-2xl mb-8'>
        <div className='flex items-center gap-4'>
          <button 
            onClick={() => navigate('/cart')}
            className='flex items-center gap-2 text-[#3d2b1f] hover:text-[#5a3c2c] transition-colors'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
            Back to Cart
          </button>
          <h1 className='font-bold text-[#3d2b1f]'>PLACE ORDER</h1>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Order Details */}
        <div>
          <h2 className='text-xl font-medium mb-4 text-[#3d2b1f]'>Order Details</h2>
          <div className='space-y-4 mb-6'>
            {items.map((item, index) => {
              const product = item.product || getProductDetails(item.itemId)
              if (!product) return null

              return (
                <div key={item.itemId || index} className='flex gap-4 p-4 border border-[#e8dccf] bg-white rounded-lg shadow-sm'>
                  <img 
                    src={product.image[0]} 
                    alt={product.name}
                    className='w-16 h-16 object-cover rounded'
                    draggable={false}
                  />
                  <div className='flex-1'>
                    <h3 className='font-medium text-[#3d2b1f]'>{product.name}</h3>
                    {item.rentalData.selectedSize && (
                      <p className='text-sm text-[#3d2b1f] opacity-80'>Size: {item.rentalData.selectedSize}</p>
                    )}
                    <p className='text-sm text-[#3d2b1f] opacity-80'>
                      {(() => {
                        const rentalDays = item.rentalData.rentalDays || 
                          Math.ceil((new Date(item.rentalData.endDate) - new Date(item.rentalData.startDate)) / (1000 * 60 * 60 * 24)) + 1;
                        return `${rentalDays} day${rentalDays > 1 ? 's' : ''}`;
                      })()}
                    </p>
                    <p className='text-sm text-[#3d2b1f] opacity-80'>{item.rentalData.startDate} to {item.rentalData.endDate}</p>
                    <div className='flex items-center gap-2'>
                      <p className='font-medium text-[#3d2b1f]'>
                        {item.product && item.product.isFree ? 'Free' : `${currency}${item.rentalData.totalPrice || 0}`}
                      </p>
                      {item.product && item.product.isFree && item.product.mrp && (
                        <span className='text-sm text-gray-400 line-through'>
                          {currency}{item.product.mrp}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Enhanced Address Form */}
          <div className='bg-white p-6 rounded-lg shadow-sm border border-[#e8dccf]'>
            <div className='flex items-center gap-2 mb-6'>
              <svg className='w-6 h-6 text-[#3d2b1f]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
              <h2 className='text-xl font-medium text-[#3d2b1f]'>Delivery Address</h2>
            </div>
            
            <div className='space-y-6'>
              {/* Personal Information */}
              <div>
                <h3 className='text-sm font-medium text-[#3d2b1f] mb-3'>Personal Information</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm text-[#3d2b1f] mb-1'>First Name *</label>
                    <input 
                      type="text" 
                      placeholder="Enter your first name"
                      value={address.firstName}
                      onChange={(e) => setAddress({...address, firstName: e.target.value})}
                      className='w-full border border-[#e8dccf] bg-[#fdf7f0] text-[#3d2b1f] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#3d2b1f] focus:border-transparent transition-all'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm text-[#3d2b1f] mb-1'>Last Name *</label>
                    <input 
                      type="text" 
                      placeholder="Enter your last name"
                      value={address.lastName}
                      onChange={(e) => setAddress({...address, lastName: e.target.value})}
                      className='w-full border border-[#e8dccf] bg-[#fdf7f0] text-[#3d2b1f] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#3d2b1f] focus:border-transparent transition-all'
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className='text-sm font-medium text-[#3d2b1f] mb-3'>Contact Information</h3>
                <div>
                  <label className='block text-sm text-[#3d2b1f] mb-1'>Phone Number *</label>
                  <input 
                    type="tel" 
                    placeholder="Enter your 10-digit phone number"
                    value={address.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '') // Only allow numbers
                      if (value.length <= 10) {
                        setAddress({...address, phone: value})
                      }
                    }}
                    className='w-full border border-[#e8dccf] bg-[#fdf7f0] text-[#3d2b1f] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#3d2b1f] focus:border-transparent transition-all'
                    maxLength="10"
                    required
                  />
                  <p className='text-xs text-[#3d2b1f] opacity-60 mt-1'>Enter 10-digit mobile number</p>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className='text-sm font-medium text-[#3d2b1f] mb-3'>Address Information</h3>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm text-[#3d2b1f] mb-1'>Street Address *</label>
                    <input 
                      type="text" 
                      placeholder="Enter your street address"
                      value={address.street}
                      onChange={(e) => setAddress({...address, street: e.target.value})}
                      className='w-full border border-[#e8dccf] bg-[#fdf7f0] text-[#3d2b1f] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#3d2b1f] focus:border-transparent transition-all'
                      required
                    />
                  </div>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm text-[#3d2b1f] mb-1'>City *</label>
                      <input 
                        type="text" 
                        placeholder="Enter your city"
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                        className='w-full border border-[#e8dccf] bg-[#fdf7f0] text-[#3d2b1f] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#3d2b1f] focus:border-transparent transition-all'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm text-[#3d2b1f] mb-1'>State *</label>
                      <select 
                        value={address.state}
                        onChange={(e) => setAddress({...address, state: e.target.value})}
                        className='w-full border border-[#e8dccf] bg-[#fdf7f0] text-[#3d2b1f] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#3d2b1f] focus:border-transparent transition-all'
                        required
                      >
                        <option value="">Select your state</option>
                        {indianStates.map((state, index) => (
                          <option key={index} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm text-[#3d2b1f] mb-1'>Country *</label>
                      <input 
                        type="text" 
                        value={address.country}
                        className='w-full border border-[#e8dccf] bg-gray-100 text-[#3d2b1f] px-3 py-2 rounded cursor-not-allowed'
                        readOnly
                        disabled
                      />
                    </div>
                    <div>
                      <label className='block text-sm text-[#3d2b1f] mb-1'>PIN Code *</label>
                      <input 
                        type="text" 
                        placeholder="Enter your 6-digit PIN code"
                        value={address.zipcode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '') // Only allow numbers
                          if (value.length <= 6) {
                            setAddress({...address, zipcode: value})
                          }
                        }}
                        className='w-full border border-[#e8dccf] bg-[#fdf7f0] text-[#3d2b1f] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#3d2b1f] focus:border-transparent transition-all'
                        maxLength="6"
                        required
                      />
                      <p className='text-xs text-[#3d2b1f] opacity-60 mt-1'>Enter 6-digit PIN code</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className='bg-[#f8f5f0] p-4 rounded-lg border border-[#e8dccf]'>
                <div className='flex items-start gap-3'>
                  <svg className='w-5 h-5 text-[#3d2b1f] mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  <div>
                    <h4 className='text-sm font-medium text-[#3d2b1f] mb-1'>Delivery Information</h4>
                    <p className='text-xs text-[#3d2b1f] opacity-80'>
                      We'll deliver your rental items to this address. Please ensure someone is available to receive the package during delivery hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Summary */}
        <div>
          <h2 className='text-xl font-medium mb-4'>Payment Method</h2>
          <div className='mb-6'>
            <div className='flex items-center p-4 border rounded-lg bg-gray-50'>
              <img 
                src={assets.razorpay_logo} 
                alt="Razorpay" 
                className='h-8 mr-3'
                draggable={false}
              />
              <div>
                <div className='font-medium'>Secure Online Payment</div>
                <div className='text-sm text-gray-500'>Powered by Razorpay</div>
              </div>
            </div>
          </div>

          <div className='bg-gray-50 p-6 rounded-lg'>
            <h3 className='text-lg font-medium mb-4'>Order Summary</h3>
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
                <span>{currency}{calculateTotal()}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || orderInProgress}
              className={`w-full py-3 rounded transition-all duration-300 ${
                isPlacingOrder || orderInProgress
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isPlacingOrder ? 'Placing Order...' : orderInProgress ? 'Processing Payment...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
