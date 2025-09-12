import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faStar, faLock } from '@fortawesome/free-solid-svg-icons'

const SubscriptionPlans = () => {
  const { token, currency } = useContext(ShopContext)
  const navigate = useNavigate()

  const plans = [
    {
      name: 'Free Tier',
      price: 0,
      period: 'forever',
      description: 'Perfect for trying out our rental service',
      features: [
        'Only 1 time rentals (2-6 days)',
        'Tier 1 prices as applicable',
        'Tier 2 prices as applicable',
        'Basic customer support',
        'Standard delivery'
      ],
      limitations: [
        'Limited to one-time rentals only',
        'No subscription benefits',
        'Standard pricing on all items'
      ],
      popular: false,
      buttonText: 'Current Plan',
      buttonStyle: 'bg-gray-200 text-gray-700 cursor-not-allowed'
    },
    {
      name: 'Rotator Plus',
      price: 1999,
      period: 'month',
      description: 'Best value for regular renters',
      features: [
        '6 Clothes, 2 swaps per month',
        'Tier 1 products FREE',
        'Tier 2 products 50% OFF',
        'Priority customer support',
        'Free pickup and delivery',
        'Early access to new arrivals',
        'Cancel anytime'
      ],
      limitations: [],
      popular: true,
      buttonText: 'Upgrade to Plus',
      buttonStyle: 'bg-black hover:bg-gray-800 text-white'
    },
    {
      name: 'Rotator Pro',
      price: 3999,
      period: 'month',
      description: 'Ultimate rental experience',
      features: [
        '8 Clothes, 2 swaps per month',
        'Tier 1 products FREE',
        'Tier 2 products FREE',
        'Premium customer support',
        'Free pickup and delivery',
        'Early access to new arrivals',
        'Exclusive designer collections',
        'Personal styling consultation',
        'Cancel anytime'
      ],
      limitations: [],
      popular: false,
      buttonText: 'Upgrade to Pro',
      buttonStyle: 'bg-black hover:bg-gray-800 text-white'
    }
  ]

  const handleUpgrade = (planName) => {
    if (!token) {
      navigate('/login')
      return
    }
    
    // Here you would integrate with your payment system
    // For now, we'll just show an alert
    alert(`Upgrade to ${planName} - Payment integration coming soon!`)
  }

  return (
    <div className='min-h-screen py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Choose Your Rental Plan
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Unlock exclusive benefits and save more with our subscription plans. 
            Rent premium fashion without the commitment of ownership.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg p-8 flex flex-col ${
                plan.popular 
                  ? 'ring-2 ring-blue-500 transform scale-105' 
                  : 'hover:shadow-xl transition-shadow duration-300'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                  <span className='bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium'>
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className='text-center mb-8'>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>{plan.name}</h3>
                <p className='text-gray-600 mb-4'>{plan.description}</p>
                <div className='mb-4'>
                  <span className='text-4xl font-bold text-gray-900'>
                    {plan.price === 0 ? 'Free' : `${currency}${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className='text-gray-600'>/{plan.period}</span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className='mb-8 flex-grow'>
                <h4 className='font-semibold text-gray-900 mb-4'>What's included:</h4>
                <ul className='space-y-3'>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className='flex items-start'>
                      <FontAwesomeIcon 
                        icon={faCheck} 
                        className='w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0' 
                      />
                      <span className='text-gray-700'>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitations for Free Plan */}
              {plan.limitations.length > 0 && (
                <div className='mb-8'>
                  <h4 className='font-semibold text-gray-900 mb-4'>Limitations:</h4>
                  <ul className='space-y-2'>
                    {plan.limitations.map((limitation, limitIndex) => (
                      <li key={limitIndex} className='flex items-start'>
                        <FontAwesomeIcon 
                          icon={faTimes} 
                          className='text-red-500 mr-3 mt-1 w-4 h-4 flex-shrink-0' 
                        />
                        <span className='text-gray-600 text-sm'>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Button - positioned at the end */}
              <div className='mt-auto'>
                <button
                  onClick={() => handleUpgrade(plan.name)}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${plan.buttonStyle}`}
                  disabled={plan.name === 'Free Tier'}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          <div className='px-8 py-6 bg-gray-50 border-b'>
            <h2 className='text-2xl font-bold text-gray-900'>Plan Comparison</h2>
            <p className='text-gray-600 mt-2'>Compare features across all plans</p>
          </div>
          
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-medium text-gray-900'>Features</th>
                  <th className='px-6 py-4 text-center text-sm font-medium text-gray-900'>Free Tier</th>
                  <th className='px-6 py-4 text-center text-sm font-medium text-blue-600'>Rotator Plus</th>
                  <th className='px-6 py-4 text-center text-sm font-medium text-purple-600'>Rotator Pro</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                <tr>
                  <td className='px-6 py-4 text-sm font-medium text-gray-900'>Monthly Rentals</td>
                  <td className='px-6 py-4 text-center text-sm text-gray-600'>1 time only</td>
                  <td className='px-6 py-4 text-center text-sm text-gray-600'>6 clothes, 2 swaps</td>
                  <td className='px-6 py-4 text-center text-sm text-gray-600'>8 clothes, 2 swaps</td>
                </tr>
                <tr className='bg-gray-50'>
                  <td className='px-6 py-4 text-sm font-medium text-gray-900'>Tier 1 Products (Upto MRP 5K)</td>
                  <td className='px-6 py-4 text-center text-sm text-gray-600'>As applicable</td>
                  <td className='px-6 py-4 text-center text-sm text-green-600 font-medium'>FREE</td>
                  <td className='px-6 py-4 text-center text-sm text-green-600 font-medium'>FREE</td>
                </tr>
                <tr>
                  <td className='px-6 py-4 text-sm font-medium text-gray-900'>Tier 2 Products (5K-15K)</td>
                  <td className='px-6 py-4 text-center text-sm text-gray-600'>As applicable</td>
                  <td className='px-6 py-4 text-center text-sm text-orange-600 font-medium'>50% OFF</td>
                  <td className='px-6 py-4 text-center text-sm text-green-600 font-medium'>FREE</td>
                </tr>
                <tr className='bg-gray-50'>
                  <td className='px-6 py-4 text-sm font-medium text-gray-900'>Customer Support</td>
                  <td className='px-6 py-4 text-center text-sm text-gray-600'>Basic</td>
                  <td className='px-6 py-4 text-center text-sm text-gray-600'>Priority</td>
                  <td className='px-6 py-4 text-center text-sm text-gray-600'>Premium</td>
                </tr>
                <tr>
                  <td className='px-6 py-4 text-sm font-medium text-gray-900'>Delivery</td>
                  <td className='px-6 py-4 text-center text-sm text-gray-600'>Standard</td>
                  <td className='px-6 py-4 text-center text-sm text-green-600 font-medium'>Free</td>
                  <td className='px-6 py-4 text-center text-sm text-green-600 font-medium'>Free</td>
                </tr>
                <tr className='bg-gray-50'>
                  <td className='px-6 py-4 text-sm font-medium text-gray-900'>Early Access</td>
                  <td className='px-6 py-4 text-center text-sm text-gray-400'>
                    <FontAwesomeIcon icon={faTimes} className='w-4 h-4' />
                  </td>
                  <td className='px-6 py-4 text-center text-sm text-green-600 font-medium'>
                    <FontAwesomeIcon icon={faCheck} className='w-4 h-4' />
                  </td>
                  <td className='px-6 py-4 text-center text-sm text-green-600 font-medium'>
                    <FontAwesomeIcon icon={faCheck} className='w-4 h-4' />
                  </td>
                </tr>
                <tr>
                  <td className='px-6 py-4 text-sm font-medium text-gray-900'>Exclusive Collections</td>
                  <td className='px-6 py-4 text-center text-sm text-gray-400'>
                    <FontAwesomeIcon icon={faTimes} className='w-4 h-4' />
                  </td>
                  <td className='px-6 py-4 text-center text-sm text-gray-400'>
                    <FontAwesomeIcon icon={faTimes} className='w-4 h-4' />
                  </td>
                  <td className='px-6 py-4 text-center text-sm text-green-600 font-medium'>
                    <FontAwesomeIcon icon={faCheck} className='w-4 h-4' />
                  </td>
                </tr>
                <tr className='bg-gray-50'>
                  <td className='px-6 py-4 text-sm font-medium text-gray-900'>Personal Styling</td>
                  <td className='px-6 py-4 text-center text-sm text-gray-400'>
                    <FontAwesomeIcon icon={faTimes} className='w-4 h-4' />
                  </td>
                  <td className='px-6 py-4 text-center text-sm text-gray-400'>
                    <FontAwesomeIcon icon={faTimes} className='w-4 h-4' />
                  </td>
                  <td className='px-6 py-4 text-center text-sm text-green-600 font-medium'>
                    <FontAwesomeIcon icon={faCheck} className='w-4 h-4' />
                  </td>
                </tr>
                <tr>
                  <td className='px-6 py-4 text-sm font-medium text-gray-900'>Monthly Price</td>
                  <td className='px-6 py-4 text-center text-sm text-gray-600 font-medium'>Free</td>
                  <td className='px-6 py-4 text-center text-sm text-blue-600 font-bold'>{currency}1,999</td>
                  <td className='px-6 py-4 text-center text-sm text-purple-600 font-bold'>{currency}3,999</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className='mt-16'>
          <h2 className='text-3xl font-bold text-center text-gray-900 mb-12'>
            Frequently Asked Questions
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Can I change my plan anytime?
              </h3>
              <p className='text-gray-600'>
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                What happens to my current rentals?
              </h3>
              <p className='text-gray-600'>
                Your current rentals remain unaffected. Plan changes only apply to future rentals.
              </p>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Is there a cancellation fee?
              </h3>
              <p className='text-gray-600'>
                No cancellation fees! You can cancel your subscription anytime without any penalties.
              </p>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                How does the swap system work?
              </h3>
              <p className='text-gray-600'>
                You can exchange your current rentals for new items up to 2 times per month with Plus and Pro plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPlans
