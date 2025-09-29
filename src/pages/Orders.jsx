import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faShoppingBag, 
  faTruck, 
  faCheckCircle, 
  faTimesCircle, 
  faClock,
  faMapMarkerAlt,
  faCreditCard,
  faCalendarAlt,
  faEye,
  faRefresh
} from '@fortawesome/free-solid-svg-icons'

const Orders = () => {
  const { token, backendUrl, user } = useContext(ShopContext)
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [token, navigate])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { 
        headers: { token } 
      })
      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        setError('Failed to load orders')
        toast.error('Failed to fetch orders')
      }
    } catch (error) {
      setError('Failed to load orders')
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed':
        return <FontAwesomeIcon icon={faShoppingBag} className="w-4 h-4" />
      case 'Processing':
        return <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
      case 'Shipped':
        return <FontAwesomeIcon icon={faTruck} className="w-4 h-4" />
      case 'Delivered':
        return <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
      case 'Cancelled':
        return <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4" />
      default:
        return <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 text-blue-800'
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'Shipped':
        return 'bg-purple-100 text-purple-800'
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateShort = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true
    return order.status === filterStatus
  })

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const getOrderProgress = (status) => {
    const steps = [
      { key: 'Order Placed', label: 'Order Placed', completed: true },
      { key: 'Processing', label: 'Processing', completed: status !== 'Order Placed' },
      { key: 'Shipped', label: 'Shipped', completed: ['Shipped', 'Delivered'].includes(status) },
      { key: 'Delivered', label: 'Delivered', completed: status === 'Delivered' }
    ]
    return steps
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2b1f] mx-auto mb-4'></div>
          <p className='text-[#3d2b1f] opacity-60'>Loading orders...</p>
        </div>
      </div>
    )
  }

  if (error || !orders) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <FontAwesomeIcon icon={faShoppingBag} className='w-16 h-16 text-gray-400 mb-4' />
          <p className='text-[#3d2b1f] opacity-60 mb-4'>{error || 'Failed to load orders'}</p>
          <div className='space-x-4'>
            <button 
              onClick={() => fetchOrders()}
              className='bg-[#3d2b1f] text-[#fdf7f0] px-6 py-2 rounded hover:bg-[#5a3c2c] transition-colors'
            >
              Retry
            </button>
            <button 
              onClick={() => navigate('/')}
              className='bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors'
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='border-t border-[#e8dccf] pt-16 bg-[#fdf7f0] text-[#3d2b1f]'>
      <div className='text-2xl mb-8'>
        <h1 className='font-bold text-[#3d2b1f]'>MY ORDERS</h1>
      </div>

      {orders.length === 0 ? (
        <div className='text-center py-16'>
          <FontAwesomeIcon icon={faShoppingBag} className='w-16 h-16 text-gray-400 mb-4' />
          <h2 className='text-xl font-medium mb-2 text-[#3d2b1f]'>No orders yet</h2>
          <p className='text-[#3d2b1f] opacity-60 mb-6'>Start shopping to see your orders here</p>
          <button 
            onClick={() => navigate('/collection')}
            className='bg-[#3d2b1f] text-[#fdf7f0] px-6 py-3 rounded hover:bg-[#5a3c2c] transition-colors'
          >
            Browse Collection
          </button>
        </div>
      ) : (
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Filter Tabs */}
          <div className='bg-white rounded-2xl shadow-sm mb-8'>
            <div className='border-b border-gray-200'>
              <nav className='flex space-x-8 px-8'>
                {['all', 'Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                      filterStatus === status
                        ? 'border-[#3d2b1f] text-[#3d2b1f]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {status === 'all' ? 'All Orders' : status}
                    {status !== 'all' && (
                      <span className='ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs'>
                        {orders.filter(order => order.status === status).length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Orders List */}
          <div className='space-y-6'>
            {filteredOrders.map((order) => (
              <div key={order._id} className='bg-white rounded-2xl shadow-sm p-6'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4'>
                  <div className='flex items-center space-x-4 mb-4 lg:mb-0'>
                    <div className='flex items-center space-x-2'>
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>Order #{order._id.slice(-8)}</p>
                      <p className='text-sm text-gray-600'>{formatDateShort(order.date)}</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <div className='text-right'>
                      <p className='text-lg font-bold text-[#3d2b1f]'>₹{order.amount}</p>
                      <p className='text-sm text-gray-600'>{order.paymentMethod}</p>
                    </div>
                    <button
                      onClick={() => handleViewOrder(order)}
                      className='bg-[#3d2b1f] text-[#fdf7f0] px-4 py-2 rounded hover:bg-[#5a3c2c] transition-colors flex items-center space-x-2'
                    >
                      <FontAwesomeIcon icon={faEye} className='w-4 h-4' />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>

                {/* Order Progress */}
                <div className='mb-4'>
                  <div className='flex items-center justify-between'>
                    {getOrderProgress(order.status).map((step, index) => (
                      <div key={step.key} className='flex items-center'>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          step.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {step.completed ? (
                            <FontAwesomeIcon icon={faCheckCircle} className='w-4 h-4' />
                          ) : (
                            <span className='text-sm font-medium'>{index + 1}</span>
                          )}
                        </div>
                        <span className={`ml-2 text-sm ${
                          step.completed ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </span>
                        {index < getOrderProgress(order.status).length - 1 && (
                          <div className={`w-16 h-0.5 mx-4 ${
                            step.completed ? 'bg-green-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className='border-t pt-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <FontAwesomeIcon icon={faShoppingBag} className='w-4 h-4 text-gray-500' />
                      <span className='text-sm text-gray-600'>
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <FontAwesomeIcon icon={faMapMarkerAlt} className='w-4 h-4 text-gray-500' />
                      <span className='text-sm text-gray-600'>
                        {order.address.city}, {order.address.state}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-[#3d2b1f]'>Order Details</h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className='text-gray-500 hover:text-gray-700'
                >
                  <FontAwesomeIcon icon={faTimesCircle} className='w-6 h-6' />
                </button>
              </div>

              {/* Order Info */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h3 className='font-semibold text-[#3d2b1f] mb-3'>Order Information</h3>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Order ID:</span>
                      <span className='font-medium'>#{selectedOrder._id.slice(-8)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Date:</span>
                      <span className='font-medium'>{formatDate(selectedOrder.date)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Payment:</span>
                      <span className='font-medium'>{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <h3 className='font-semibold text-[#3d2b1f] mb-3'>Delivery Address</h3>
                  <div className='text-sm text-gray-600'>
                    <p>{selectedOrder.address.name}</p>
                    <p>{selectedOrder.address.street}</p>
                    <p>{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.pincode}</p>
                    <p>Phone: {selectedOrder.address.phone}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className='mb-6'>
                <h3 className='font-semibold text-[#3d2b1f] mb-3'>Order Items</h3>
                <div className='space-y-4'>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className='border rounded-lg p-4'>
                      <div className='flex items-center space-x-4'>
                        <div className='w-16 h-16 bg-gray-200 rounded flex items-center justify-center'>
                          <FontAwesomeIcon icon={faShoppingBag} className='w-6 h-6 text-gray-500' />
                        </div>
                        <div className='flex-1'>
                          <h4 className='font-medium text-[#3d2b1f]'>Product #{item.itemId.slice(-8)}</h4>
                          <p className='text-sm text-gray-600'>
                            Rental Period: {new Date(item.rentalData.startDate).toLocaleDateString()} - {new Date(item.rentalData.endDate).toLocaleDateString()}
                          </p>
                          <p className='text-sm text-gray-600'>
                            Quantity: {item.rentalData.quantity || 1}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-medium text-[#3d2b1f]'>₹{item.rentalData.totalPrice || 0}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className='bg-gray-50 rounded-lg p-4'>
                <h3 className='font-semibold text-[#3d2b1f] mb-3'>Order Summary</h3>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Subtotal:</span>
                    <span>₹{selectedOrder.amount - 10}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Delivery:</span>
                    <span>₹10</span>
                  </div>
                  <hr />
                  <div className='flex justify-between font-semibold text-lg'>
                    <span>Total:</span>
                    <span>₹{selectedOrder.amount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders