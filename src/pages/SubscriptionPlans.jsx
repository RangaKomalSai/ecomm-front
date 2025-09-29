import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import SubscriptionBadge from '../components/SubscriptionBadge';
import Title from '../components/Title';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCrown, faStar, faRocket, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const SubscriptionPlans = () => {
    const { 
        userType, 
        subscriptionPlans, 
        upgradeSubscription, 
        token,
        navigate,
        backendUrl
    } = useContext(ShopContext);

    const [loading, setLoading] = useState(false);

    const handleUpgrade = async (planId) => {
        if (!token) {
            toast.info('Please login to upgrade your subscription');
            navigate('/login');
            return;
        }

        if (planId === userType) {
            toast.info('You are already on this plan');
            return;
        }

        // Find the plan details
        const targetPlan = subscriptionPlans.find(plan => plan.id === planId);
        if (!targetPlan) {
            toast.error('Plan not found');
            return;
        }

        // If it's a downgrade (to free), handle differently
        if (planId === 'free') {
            const confirmed = window.confirm('Are you sure you want to downgrade to the free plan? You will lose all subscription benefits.');
            if (!confirmed) return;
            
            setLoading(true);
            try {
                const success = await upgradeSubscription(planId);
                if (success) {
                    toast.success('Successfully downgraded to free plan');
                }
            } catch (error) {
                toast.error('Failed to downgrade subscription');
            } finally {
                setLoading(false);
            }
            return;
        }

        // For upgrades, initiate payment
        setLoading(true);
        try {
            await initiatePayment(targetPlan);
        } catch (error) {
            toast.error('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const initiatePayment = async (plan) => {
        try {
            // Create subscription payment order
            const response = await axios.post(backendUrl + '/api/subscription/payment', {
                newUserType: plan.id
            }, { headers: { token } });

            if (response.data.success) {
                // Handle Razorpay payment
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: response.data.order.amount,
                    currency: response.data.order.currency,
                    name: 'Vesper Rental',
                    description: `${plan.name} Subscription`,
                    order_id: response.data.order.id,
                    handler: function (paymentResponse) {
                        verifySubscriptionPayment(paymentResponse);
                    },
                    prefill: {
                        name: 'User',
                        email: 'user@example.com',
                        contact: '9999999999'
                    }
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to initiate payment');
        }
    };

    const verifySubscriptionPayment = async (paymentResponse) => {
        try {
            const response = await axios.post(backendUrl + '/api/subscription/verify-payment', {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature
            }, { headers: { token } });

            if (response.data.success) {
                toast.success('Subscription payment successful!');
                // Refresh the page to update subscription status
                window.location.reload();
            } else {
                toast.error('Payment verification failed');
            }
        } catch (error) {
            toast.error('Payment verification failed');
        }
    };

    const getPlanStatus = (planId) => {
        if (planId === userType) return 'current';
        if (planId === 'free') return 'downgrade';
        return 'upgrade';
    };

    const getButtonText = (planId) => {
        if (planId === userType) {
            return 'Current Plan';
        }
        
        // Determine if it's an upgrade or downgrade based on plan hierarchy
        const planHierarchy = ['free', 'plus', 'pro'];
        const currentIndex = planHierarchy.indexOf(userType);
        const targetIndex = planHierarchy.indexOf(planId);
        
        if (targetIndex > currentIndex) {
            return 'Upgrade';
        } else if (targetIndex < currentIndex) {
            return 'Downgrade';
        }
        
        return 'Select Plan';
    };

    const getButtonClass = (planId) => {
        if (planId === userType) {
            return 'bg-green-100 text-green-600 cursor-not-allowed';
        }
        
        // Determine if it's an upgrade or downgrade based on plan hierarchy
        const planHierarchy = ['free', 'plus', 'pro'];
        const currentIndex = planHierarchy.indexOf(userType);
        const targetIndex = planHierarchy.indexOf(planId);
        
        if (targetIndex > currentIndex) {
            // Upgrade - blue button
            return 'bg-blue-600 text-white hover:bg-blue-700';
        } else if (targetIndex < currentIndex) {
            // Downgrade - gray button
            return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
        }
        
        return 'bg-blue-600 text-white hover:bg-blue-700';
    };

    const getPlanHighlightClass = (planId) => {
        // Don't highlight current plan - only highlight recommended next plan
        
        // Recommended plan highlighting
        if (!token && planId === 'plus') {
            // Not logged in - highlight Plus as most popular
            return 'border-blue-500 ring-2 ring-blue-100 bg-blue-50';
        }
        
        if (token) {
            // Logged in - highlight next plan only
            if (userType === 'free' && planId === 'plus') {
                return 'border-blue-500 ring-2 ring-blue-100 bg-blue-50';
            }
            if (userType === 'plus' && planId === 'pro') {
                return 'border-blue-500 ring-2 ring-blue-100 bg-blue-50';
            }
        }
        
        return 'border-gray-200';
    };

    return (
        <div className="bg-[#fdf7f0] text-[#3d2b1f] min-h-screen">
            {/* Hero Section */}
            <div className="text-center py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3d2b1f] mb-4">
                        <span className="block">SUBSCRIPTION</span>
                        <span className="block text-[#8b4513]">PLANS</span>
                    </h1>
                    <div className="w-32 h-1 bg-gradient-to-r from-[#3d2b1f] to-[#8b4513] mx-auto mt-6 rounded-full"></div>
                    <p className="text-lg text-[#3d2b1f] opacity-80 mt-6 max-w-2xl mx-auto">
                        Unlock exclusive benefits and save money on your rentals with our subscription plans
                    </p>
                </div>
            </div>

            {/* Current Plan Badge */}
            {/* {token && (
                <div className="text-center mb-12">
                    <SubscriptionBadge userType={userType} size="normal" />
                </div>
            )} */}

            {/* Subscription Plans */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {subscriptionPlans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative bg-white rounded-xl shadow-lg border-2 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${getPlanHighlightClass(plan.id)}`}
                    >
                        {/* Popular Badge */}
                        {((!token && plan.id === 'plus') || 
                          (token && userType === 'free' && plan.id === 'plus') ||
                          (token && userType === 'plus' && plan.id === 'pro')) && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-gradient-to-r from-[#3d2b1f] to-[#8b4513] text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                                    <FontAwesomeIcon icon={faStar} className="w-4 h-4 mr-2" />
                                    {!token ? 'Most Popular' : 'Recommended'}
                                </span>
                            </div>
                        )}

                        {/* Plan Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-[#fdf7f0] rounded-full flex items-center justify-center mx-auto mb-4">
                                {plan.id === 'free' && <FontAwesomeIcon icon={faRocket} className="w-8 h-8 text-[#3d2b1f]" />}
                                {plan.id === 'plus' && <FontAwesomeIcon icon={faStar} className="w-8 h-8 text-[#8b4513]" />}
                                {plan.id === 'pro' && <FontAwesomeIcon icon={faCrown} className="w-8 h-8 text-[#3d2b1f]" />}
                            </div>
                            <h3 className="text-2xl font-bold text-[#3d2b1f] mb-2">
                                {plan.name}
                            </h3>
                            <div className="text-4xl font-bold text-[#3d2b1f] mb-2">
                                {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                                {plan.price > 0 && <span className="text-lg text-[#3d2b1f] opacity-60">/month</span>}
                            </div>
                            <p className="text-[#3d2b1f] opacity-80">
                                {plan.id === 'free' && 'Pay as you go'}
                                {plan.id === 'plus' && 'Best value for regular renters'}
                                {plan.id === 'pro' && 'Maximum savings for frequent users'}
                            </p>
                        </div>

                        {/* Features */}
                        <div className="mb-8">
                            <h4 className="font-semibold text-[#3d2b1f] mb-4 text-center">What's included:</h4>
                            <ul className="space-y-3">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-[#8b4513] mt-0.5 flex-shrink-0" />
                                        <span className="text-[#3d2b1f]">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Benefits Display */}
                        {plan.benefits && (
                            <div className="mb-6 p-6 bg-gradient-to-r from-[#fdf7f0] to-[#f5ece3] rounded-xl border border-[#e8dccf]">
                                <h5 className="font-semibold text-[#3d2b1f] mb-4 text-center">Pricing Benefits:</h5>
                                <div className="space-y-2 text-sm text-[#3d2b1f]">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Premium (MRP &lt; ₹5000):</span>
                                        <span className="text-[#8b4513] font-semibold">{plan.benefits.premiumPricing}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Royal (MRP ₹5000-₹15000):</span>
                                        <span className="text-[#8b4513] font-semibold">{plan.benefits.royalPricing}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Luxury (MRP ₹15000+):</span>
                                        <span className="text-[#8b4513] font-semibold">{plan.benefits.luxuryPricing}</span>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-[#e8dccf] text-center">
                                        <span className="text-xs text-[#3d2b1f] opacity-60">Monthly Limit: {plan.benefits.monthlyLimit}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <button
                            onClick={() => handleUpgrade(plan.id)}
                            disabled={loading || plan.id === userType}
                            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${getButtonClass(plan.id)}`}
                        >
                            {loading ? 'Processing...' : getButtonText(plan.id)}
                        </button>

                        {/* Current Plan Indicator */}
                        {plan.id === userType && (
                            <div className="mt-4 text-center">
                                <span className="text-green-600 font-medium text-sm bg-green-50 px-4 py-2 rounded-full">
                                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4 mr-2" />
                                    You're currently on this plan
                                </span>
                            </div>
                        )}
                    </div>
                ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#3d2b1f] mb-4">
                        Frequently Asked Questions
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#3d2b1f] to-[#8b4513] mx-auto rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <FontAwesomeIcon icon={faQuestionCircle} className="w-6 h-6 text-[#8b4513]" />
                            <h3 className="font-semibold text-[#3d2b1f] text-lg">How does the pricing work?</h3>
                        </div>
                        <p className="text-[#3d2b1f] opacity-80 leading-relaxed">
                            Products are categorized into Premium, Royal, and Luxury tiers based on their MRP. 
                            Free users pay full price, Plus users get Premium free and Royal at 50% off, 
                            while Pro users get Premium and Royal free. Both Plus and Pro have a 6-clothes-per-month limit.
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <FontAwesomeIcon icon={faQuestionCircle} className="w-6 h-6 text-[#8b4513]" />
                            <h3 className="font-semibold text-[#3d2b1f] text-lg">Can I change my plan anytime?</h3>
                        </div>
                        <p className="text-[#3d2b1f] opacity-80 leading-relaxed">
                            Yes! You can upgrade or downgrade your subscription at any time. 
                            Changes take effect immediately.
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <FontAwesomeIcon icon={faQuestionCircle} className="w-6 h-6 text-[#8b4513]" />
                            <h3 className="font-semibold text-[#3d2b1f] text-lg">What happens to my cart?</h3>
                        </div>
                        <p className="text-[#3d2b1f] opacity-80 leading-relaxed">
                            Your cart will automatically update with new pricing when you upgrade. 
                            You'll see your savings immediately.
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <FontAwesomeIcon icon={faQuestionCircle} className="w-6 h-6 text-[#8b4513]" />
                            <h3 className="font-semibold text-[#3d2b1f] text-lg">Is there a free trial?</h3>
                        </div>
                        <p className="text-[#3d2b1f] opacity-80 leading-relaxed">
                            Currently, we don't offer free trials, but you can start with the Free plan 
                            and upgrade anytime to see the benefits.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlans;