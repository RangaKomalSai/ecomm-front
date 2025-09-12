import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const PlaceOrder = () => {

  const { cartItems, getCartAmount, backendUrl, token, currency } = useContext(ShopContext)
  const [cartData, setCartData] = useState({})
  const [products, setProducts] = useState([])
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    phone: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('COD')
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
    } else {
      navigate('/login')
    }
  }, [token])

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
    return total + 10 // Add delivery charge
  }

  const handlePlaceOrder = async () => {
    if (!address.firstName || !address.lastName || !address.street || !address.city || !address.state || !address.country || !address.zipcode || !address.phone) {
      toast.error('Please fill in all address fields')
      return
    }

    if (Object.keys(cartData).length === 0) {
      toast.error('Your cart is empty')
      return
    }

    try {
      const items = Object.values(cartData).map(item => ({
        itemId: item.itemId,
        rentalData: item.rentalData
      }))

      if (paymentMethod === 'COD') {
        const response = await axios.post(backendUrl + '/api/order/place', {
          userId: 'current_user_id', // This should be replaced with actual user ID
          items,
          amount: calculateTotal(),
          address
        }, { headers: { token } })

        if (response.data.success) {
          toast.success('Order placed successfully!')
          navigate('/orders')
        }
      } else if (paymentMethod === 'Razorpay') {
        const response = await axios.post(backendUrl + '/api/order/razorpay', {
          userId: 'current_user_id', // This should be replaced with actual user ID
          items,
          address
        }, { headers: { token } })

        if (response.data.success) {
          // Handle Razorpay payment
          const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount: response.data.order.amount,
            currency: response.data.order.currency,
            name: 'Vesper Rental',
            description: 'Rental Order',
            order_id: response.data.order.id,
            handler: function (response) {
              verifyPayment(response)
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
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to place order')
    }
  }

  const verifyPayment = async (paymentResponse) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/verifyRazorpay', {
        userId: 'current_user_id',
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature
      }, { headers: { token } })

      if (response.data.success) {
        toast.success('Payment successful!')
        navigate('/orders')
      } else {
        toast.error('Payment verification failed')
      }
    } catch (error) {
      console.log(error)
      toast.error('Payment verification failed')
    }
  }

  if (Object.keys(cartData).length === 0) {
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
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <h1 className='font-bold'>PLACE ORDER</h1>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Order Details */}
        <div>
          <h2 className='text-xl font-medium mb-4'>Order Details</h2>
          <div className='space-y-4 mb-6'>
            {Object.entries(cartData).map(([itemKey, item]) => {
              const product = getProductDetails(item.itemId)
              if (!product) return null

              return (
                <div key={itemKey} className='flex gap-4 p-4 border rounded'>
                  <img 
                    src={product.image[0]} 
                    alt={product.name}
                    className='w-16 h-16 object-cover rounded'
                  />
                  <div className='flex-1'>
                    <h3 className='font-medium'>{product.name}</h3>
                    <p className='text-sm text-gray-600'>{item.rentalData.rentalDays} day{item.rentalData.rentalDays > 1 ? 's' : ''}</p>
                    <p className='text-sm text-gray-600'>{item.rentalData.startDate} to {item.rentalData.endDate}</p>
                    <p className='font-medium'>{currency}{item.rentalData.totalPrice}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Address Form */}
          <h2 className='text-xl font-medium mb-4'>Delivery Address</h2>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <input 
                type="text" 
                placeholder="First Name"
                value={address.firstName}
                onChange={(e) => setAddress({...address, firstName: e.target.value})}
                className='border px-3 py-2 rounded'
                required
              />
              <input 
                type="text" 
                placeholder="Last Name"
                value={address.lastName}
                onChange={(e) => setAddress({...address, lastName: e.target.value})}
                className='border px-3 py-2 rounded'
                required
              />
            </div>
            <input 
              type="text" 
              placeholder="Street Address"
              value={address.street}
              onChange={(e) => setAddress({...address, street: e.target.value})}
              className='border px-3 py-2 rounded w-full'
              required
            />
            <div className='grid grid-cols-2 gap-4'>
              <input 
                type="text" 
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({...address, city: e.target.value})}
                className='border px-3 py-2 rounded'
                required
              />
              <input 
                type="text" 
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({...address, state: e.target.value})}
                className='border px-3 py-2 rounded'
                required
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <input 
                type="text" 
                placeholder="Country"
                value={address.country}
                onChange={(e) => setAddress({...address, country: e.target.value})}
                className='border px-3 py-2 rounded'
                required
              />
              <input 
                type="text" 
                placeholder="ZIP Code"
                value={address.zipcode}
                onChange={(e) => setAddress({...address, zipcode: e.target.value})}
                className='border px-3 py-2 rounded'
                required
              />
            </div>
            <input 
              type="tel" 
              placeholder="Phone Number"
              value={address.phone}
              onChange={(e) => setAddress({...address, phone: e.target.value})}
              className='border px-3 py-2 rounded w-full'
              required
            />
          </div>
        </div>

        {/* Payment & Summary */}
        <div>
          <h2 className='text-xl font-medium mb-4'>Payment Method</h2>
          <div className='space-y-3 mb-6'>
            <label className='flex items-center'>
              <input 
                type="radio" 
                name="payment" 
                value="COD" 
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className='mr-2'
              />
              Cash on Delivery
            </label>
            <label className='flex items-center'>
              <input 
                type="radio" 
                name="payment" 
                value="Razorpay" 
                checked={paymentMethod === 'Razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className='mr-2'
              />
              Razorpay
            </label>
          </div>

          <div className='bg-gray-50 p-6 rounded-lg'>
            <h3 className='text-lg font-medium mb-4'>Order Summary</h3>
            <div className='space-y-2 mb-4'>
              <div className='flex justify-between'>
                <span>Subtotal:</span>
                <span>{currency}{calculateTotal() - 10}</span>
              </div>
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
              className='w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors'
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
