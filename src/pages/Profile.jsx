import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faStar, faCrown, faUser, faMoneyBillWave, faHistory } from '@fortawesome/free-solid-svg-icons'
import SubscriptionBadge from '../components/SubscriptionBadge'

const Profile = () => {
  const { token, backendUrl, user, setUser } = useContext(ShopContext)
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  })
  const [totalSaved, setTotalSaved] = useState(0)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchUserData()
  }, [token, navigate])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.post(backendUrl + '/api/user/profile', {}, { 
        headers: { token } 
      })
      if (response.data.success) {
        setUserData(response.data.user)
        setEditForm({
          name: response.data.user.name,
          email: response.data.user.email
        })
        // Calculate total saved from rental history
        if (response.data.user.rentalHistory) {
          const saved = response.data.user.rentalHistory.reduce((total, rental) => {
            return total + (rental.savedAmount || 0)
          }, 0)
          setTotalSaved(saved)
        }
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
      setError('Failed to load profile data')
      toast.error('Failed to fetch profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm({
      name: userData.name,
      email: userData.email
    })
  }

  const handleSave = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/user/update-profile', editForm, { 
        headers: { token } 
      })
      if (response.data.success) {
        setUserData({ ...userData, ...editForm })
        setIsEditing(false)
        toast.success('Profile updated successfully')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    })
  }


  const getSubscriptionBenefits = (userType) => {
    switch (userType) {
      case 'plus':
        return [
          '6 Clothes, 2 swaps per month',
          'Premium products FREE',
          'Royal products 50% OFF',
          'Priority customer support',
          'Free pickup and delivery'
        ]
      case 'pro':
        return [
          '8 Clothes, 2 swaps per month',
          'Premium products FREE',
          'Royal products FREE',
          'Premium customer support',
          'Free pickup and delivery',
          'Exclusive designer collections',
          'Personal styling consultation'
        ]
      default:
        return [
          'Only 1 time rentals (2-6 days)',
          'Premium prices as applicable',
          'Royal prices as applicable',
          'Basic customer support'
        ]
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <FontAwesomeIcon icon={faUser} className='w-16 h-16 text-gray-400 mb-4' />
          <p className='text-gray-600 mb-4'>{error || 'Failed to load profile data'}</p>
          <div className='space-x-4'>
            <button 
              onClick={() => fetchUserData()}
              className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700'
            >
              Retry
            </button>
            <button 
              onClick={() => navigate('/')}
              className='bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700'
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const subscriptionBenefits = getSubscriptionBenefits(userData.userType)

  return (
    <div className='border-t border-[#e8dccf] pt-16 bg-[#fdf7f0] text-[#3d2b1f]'>
      <div className='text-2xl mb-8'>
        <h1 className='font-bold text-[#3d2b1f]'>MY PROFILE</h1>
      </div>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='bg-white rounded-2xl shadow-sm p-8 mb-8'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
            <div className='flex items-center space-x-4 mb-4 md:mb-0'>
              <div className='w-20 h-20 bg-[#e8dccf] rounded-full flex items-center justify-center'>
                <span className='text-2xl font-bold text-[#3d2b1f]'>
                  {userData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className='text-3xl font-bold text-[#3d2b1f]'>{userData.name}</h1>
                <p className='text-[#3d2b1f] opacity-80'>{userData.email}</p>
                <div className='mt-2'>
                  <SubscriptionBadge userType={userData.userType} size="small" />
                </div>
              </div>
            </div>
            <div className='flex space-x-3'>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className='bg-[#3d2b1f] text-[#fdf7f0] px-6 py-2 rounded-lg hover:bg-[#5a3c2c] transition-colors'
                >
                  Edit Profile
                </button>
              ) : (
                <div className='flex space-x-2'>
                  <button
                    onClick={handleSave}
                    className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors'
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className='bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors'
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='bg-white rounded-2xl shadow-sm mb-8'>
          <div className='border-b border-gray-200'>
            <nav className='flex space-x-8 px-8'>
              {['overview', 'subscription', 'rental-history', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </nav>
          </div>

          <div className='p-8'>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className='space-y-8'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900 mb-6'>Account Overview</h2>
                  
                  {/* Profile Information */}
                  <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Profile Information</h3>
                    {isEditing ? (
                      <div className='space-y-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>Name</label>
                          <input
                            type='text'
                            name='name'
                            value={editForm.name}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                          <input
                            type='email'
                            name='email'
                            value={editForm.email}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                          />
                        </div>
                      </div>
                    ) : (
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <p className='text-sm text-gray-600'>Name</p>
                          <p className='text-lg font-medium text-gray-900'>{userData.name}</p>
                        </div>
                        <div>
                          <p className='text-sm text-gray-600'>Email</p>
                          <p className='text-lg font-medium text-gray-900'>{userData.email}</p>
                        </div>
                        <div>
                          <p className='text-sm text-gray-600'>Member Since</p>
                          <p className='text-lg font-medium text-gray-900'>
                            {userData.createdAt 
                              ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                              : userData._id 
                                ? new Date(parseInt(userData._id.substring(0, 8), 16) * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                : 'N/A'
                            }
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-gray-600'>Account Status</p>
                          <p className='text-lg font-medium text-green-600'>Active</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='bg-blue-50 rounded-lg p-6'>
                      <div className='flex items-center'>
                        <FontAwesomeIcon icon={faShoppingCart} className='w-6 h-6 mr-3 text-blue-600' />
                        <div>
                          <p className='text-sm text-blue-600'>Total Rentals</p>
                          <p className='text-2xl font-bold text-blue-900'>{userData.rentalHistory?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                    <div className='bg-green-50 rounded-lg p-6'>
                      <div className='flex items-center'>
                        <FontAwesomeIcon icon={faMoneyBillWave} className='w-6 h-6 mr-3 text-green-600' />
                        <div>
                          <p className='text-sm text-green-600'>Total Saved</p>
                          <p className='text-2xl font-bold text-green-900'>₹{totalSaved.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className='bg-purple-50 rounded-lg p-6'>
                      <div className='flex items-center'>
                        <FontAwesomeIcon icon={faCrown} className='w-6 h-6 mr-3 text-purple-600' />
                        <div>
                          <p className='text-sm text-purple-600'>Current Plan</p>
                          <p className='text-2xl font-bold text-purple-900'>
                            {userData.userType === 'plus' ? 'Rotator Plus' : 
                             userData.userType === 'pro' ? 'Rotator Pro' : 'Free Tier'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className='space-y-8'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900 mb-6'>Subscription Details</h2>
                  
                  {/* Current Plan */}
                  <div className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='flex items-center gap-3 mb-2'>
                          <h3 className='text-xl font-bold text-gray-900'>Current Plan</h3>
                          <SubscriptionBadge userType={userData.userType} />
                        </div>
                        <p className='text-gray-600 mb-4'>
                          {userData.userType === 'free' 
                            ? 'Free forever - no subscription required'
                            : 'Active subscription - billed monthly'
                          }
                        </p>
                        <div className='flex flex-wrap gap-2'>
                          {subscriptionBenefits.map((benefit, index) => (
                            <span key={index} className='bg-white bg-opacity-50 px-3 py-1 rounded-full text-sm text-gray-700'>
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='text-3xl font-bold text-gray-900'>
                          {userData.userType === 'free' ? 'Free' : userData.userType === 'plus' ? '₹1999' : '₹3999'}
                        </p>
                        <p className='text-gray-600'>per month</p>
                      </div>
                    </div>
                  </div>

                  {/* Upgrade Options */}
                  {userData.userType !== 'pro' && (
                    <div className='bg-white border border-gray-200 rounded-lg p-6'>
                      <h3 className='text-lg font-semibold text-gray-900 mb-4'>Upgrade Your Plan</h3>
                      <p className='text-gray-600 mb-6'>
                        Unlock more benefits and save more on your rentals
                      </p>
                      <div className='flex space-x-4'>
                        {userData.userType === 'free' && (
                          <button
                            onClick={() => navigate('/subscription-plans')}
                            className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
                          >
                            View All Plans
                          </button>
                        )}
                        {userData.userType === 'plus' && (
                          <button
                            onClick={() => navigate('/subscription-plans')}
                            className='bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors'
                          >
                            Upgrade to Pro
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rental History Tab */}
            {activeTab === 'rental-history' && (
              <div className='space-y-8'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900 mb-6'>Rental History</h2>
                  
                  {userData.rentalHistory && userData.rentalHistory.length > 0 ? (
                    <div className='space-y-4'>
                      {userData.rentalHistory.map((rental, index) => (
                        <div key={index} className='bg-gray-50 rounded-lg p-6'>
                          <div className='flex items-center justify-between'>
                            <div>
                              <h3 className='text-lg font-semibold text-gray-900'>Rental #{rental._id}</h3>
                              <p className='text-gray-600'>Rented on {new Date(rental.date).toLocaleDateString()}</p>
                            </div>
                            <div className='text-right'>
                              <p className='text-lg font-bold text-gray-900'>₹{rental.amount}</p>
                              <p className='text-sm text-gray-600'>{rental.status}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-12'>
                      <FontAwesomeIcon icon={faHistory} className='w-12 h-12 mx-auto mb-4 text-gray-400' />
                      <h3 className='text-lg font-semibold text-gray-900 mb-2'>No rental history yet</h3>
                      <p className='text-gray-600 mb-6'>Start renting to see your history here</p>
                      <button
                        onClick={() => navigate('/collection')}
                        className='bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors'
                      >
                        Browse Collection
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className='space-y-8'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900 mb-6'>Account Settings</h2>
                  
                  <div className='space-y-6'>
                    {/* Notification Settings */}
                    <div className='bg-gray-50 rounded-lg p-6'>
                      <h3 className='text-lg font-semibold text-gray-900 mb-4'>Notifications</h3>
                      <div className='space-y-3'>
                        <label className='flex items-center'>
                          <input 
                            type='checkbox' 
                            className='rounded border-gray-300 text-black focus:ring-black' 
                            defaultChecked 
                            aria-label='Email notifications for new arrivals'
                          />
                          <span className='ml-3 text-gray-700'>Email notifications for new arrivals</span>
                        </label>
                        <label className='flex items-center'>
                          <input 
                            type='checkbox' 
                            className='rounded border-gray-300 text-black focus:ring-black' 
                            defaultChecked 
                            aria-label='Rental reminders and updates'
                          />
                          <span className='ml-3 text-gray-700'>Rental reminders and updates</span>
                        </label>
                        <label className='flex items-center'>
                          <input 
                            type='checkbox' 
                            className='rounded border-gray-300 text-black focus:ring-black' 
                            aria-label='Marketing emails and promotions'
                          />
                          <span className='ml-3 text-gray-700'>Marketing emails and promotions</span>
                        </label>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className='bg-gray-50 rounded-lg p-6'>
                      <h3 className='text-lg font-semibold text-gray-900 mb-4'>Privacy</h3>
                      <div className='space-y-3'>
                        <label className='flex items-center'>
                          <input 
                            type='checkbox' 
                            className='rounded border-gray-300 text-black focus:ring-black' 
                            defaultChecked 
                            aria-label='Make profile visible to other users'
                          />
                          <span className='ml-3 text-gray-700'>Make profile visible to other users</span>
                        </label>
                        <label className='flex items-center'>
                          <input 
                            type='checkbox' 
                            className='rounded border-gray-300 text-black focus:ring-black' 
                            aria-label='Allow data analytics'
                          />
                          <span className='ml-3 text-gray-700'>Allow data analytics</span>
                        </label>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
                      <h3 className='text-lg font-semibold text-red-900 mb-4'>Danger Zone</h3>
                      <p className='text-red-700 mb-4'>These actions are irreversible. Please proceed with caution.</p>
                      <button className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'>
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
