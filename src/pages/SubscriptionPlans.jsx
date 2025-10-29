import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCrown,
  faStar,
  faRocket,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

const SubscriptionPlans = () => {
  const {
    token,
    planLevel,
    subscription,
    upgradePlan,
    verifyPlanPayment,
    cancelPlan,
    subscriptionPlans,
    categoryInfo,
    loading,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async (planId) => {
    if (!token) {
      toast.info("Please login to upgrade your subscription");
      navigate("/login");
      return;
    }

    if (planId === planLevel) {
      toast.info("You are already on this plan");
      return;
    }

    // Find the plan details
    const targetPlan = subscriptionPlans.find((plan) => plan.id === planId);
    if (!targetPlan) {
      toast.error("Plan not found");
      return;
    }

    // If downgrading to free, handle via cancel subscription
    if (planId === "free") {
      const confirmed = window.confirm(
        "Are you sure you want to cancel your subscription? You will lose all subscription benefits immediately."
      );
      if (!confirmed) return;

      setIsProcessing(true);
      try {
        await cancelPlan(true); // immediate cancellation
        toast.success("Subscription cancelled successfully");
      } catch (error) {
        toast.error("Failed to cancel subscription");
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // For upgrades to Plus or Pro, initiate payment
    setIsProcessing(true);
    try {
      await initiatePayment(targetPlan);
    } catch (error) {
      toast.error("Payment initiation failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const initiatePayment = async (plan) => {
    try {
      // Call context function to create subscription order
      const response = await upgradePlan(plan.id);

      if (response.success) {
        // Load Razorpay script if not loaded
        if (!window.Razorpay) {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          document.body.appendChild(script);
          await new Promise((resolve) => (script.onload = resolve));
        }

        // Handle Razorpay payment
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: response.order.amount,
          currency: response.order.currency || "INR",
          name: "Vesper",
          description: `${plan.name} Subscription - ${plan.duration}`,
          order_id: response.order.id,
          handler: async function (paymentResponse) {
            await handlePaymentSuccess(paymentResponse);
          },
          prefill: {
            name: subscription?.user?.name || "",
            email: subscription?.user?.email || "",
          },
          theme: {
            color: "#3d2b1f",
          },
          modal: {
            ondismiss: function () {
              toast.info("Payment cancelled");
              setIsProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error(response.message || "Failed to create order");
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("Failed to initiate payment");
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      // Verify payment using context function
      const result = await verifyPlanPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });

      if (result.success) {
        // Success toast is already shown in context
        // Optional: Navigate to profile or show success modal
      }
    } catch (error) {
      toast.error("Payment verification failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtonText = (planId) => {
    if (planId === planLevel) {
      return "Current Plan";
    }

    // Determine if it's an upgrade or downgrade based on plan hierarchy
    const planHierarchy = ["free", "plus", "pro"];
    const currentIndex = planHierarchy.indexOf(planLevel);
    const targetIndex = planHierarchy.indexOf(planId);

    if (targetIndex > currentIndex) {
      return "Upgrade Now";
    } else if (targetIndex < currentIndex) {
      return "Cancel Subscription";
    }

    return "Select Plan";
  };

  const getButtonClass = (planId) => {
    if (planId === planLevel) {
      return "bg-green-100 text-green-700 cursor-not-allowed border-2 border-green-300";
    }

    // Determine if it's an upgrade or downgrade
    const planHierarchy = ["free", "plus", "pro"];
    const currentIndex = planHierarchy.indexOf(planLevel);
    const targetIndex = planHierarchy.indexOf(planId);

    if (targetIndex > currentIndex) {
      // Upgrade - primary button
      return "bg-[#3d2b1f] text-white hover:bg-[#5a3c2c] border-2 border-[#3d2b1f]";
    } else if (targetIndex < currentIndex) {
      // Downgrade - danger button
      return "bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-300";
    }

    return "bg-[#3d2b1f] text-white hover:bg-[#5a3c2c] border-2 border-[#3d2b1f]";
  };

  const getPlanHighlightClass = (plan) => {
    // Highlight recommended plan (computed below)
    if (plan.id === recommendedPlanId) {
      return "border-[#8b4513] ring-4 ring-amber-100 bg-gradient-to-br from-white to-amber-50";
    }

    return "border-[#e8dccf]";
  };

  const getPlanIcon = (planId) => {
    switch (planId) {
      case "free":
        return faRocket;
      case "plus":
        return faStar;
      case "pro":
        return faCrown;
      default:
        return faRocket;
    }
  };

  // Loading state
  if (loading || subscriptionPlans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf7f0]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2b1f]"></div>
          <p className="text-[#3d2b1f]">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  // Determine recommended plan based on current user's plan: the next higher plan in the hierarchy
  const planHierarchy = ["free", "plus", "pro"];
  const currentIdx = planHierarchy.indexOf(planLevel || "free");
  const recommendedPlanId =
    currentIdx >= 0 && currentIdx < planHierarchy.length - 1
      ? planHierarchy[currentIdx + 1]
      : null;

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
            Unlock exclusive benefits and save money on your rentals with our
            subscription plans
          </p>
        </div>
      </div>

      {/* Current Plan Display */}
      {token && subscription && (
        <div className="max-w-4xl mx-auto px-4 mb-12">
          <div className="bg-white rounded-xl shadow-lg border-2 border-[#e8dccf] p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#3d2b1f] to-[#8b4513] rounded-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faCrown}
                    className="w-6 h-6 text-white"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Plan</p>
                  <p className="text-xl font-bold text-[#3d2b1f] capitalize">
                    {planLevel} Plan
                  </p>
                </div>
              </div>
              {subscription.isActive && planLevel !== "free" && (
                <div className="text-center md:text-right">
                  <p className="text-sm text-gray-600">Valid Until</p>
                  <p className="text-lg font-semibold text-[#3d2b1f]">
                    {new Date(subscription.endDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                  {subscription.autoRenew && (
                    <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      Auto-renew enabled
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subscription Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl shadow-lg border-2 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${getPlanHighlightClass(
                plan
              )}`}
            >
              {/* Recommended Badge (computed) */}
              {plan.id === recommendedPlanId && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#3d2b1f] to-[#8b4513] text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg whitespace-nowrap">
                    <FontAwesomeIcon icon={faStar} className="w-4 h-4 mr-2" />
                    Recommended
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#fdf7f0] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#e8dccf]">
                  <FontAwesomeIcon
                    icon={getPlanIcon(plan.id)}
                    className="w-8 h-8 text-[#3d2b1f]"
                  />
                </div>
                <h3 className="text-2xl font-bold text-[#3d2b1f] mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-[#3d2b1f] mb-2">
                  {plan.price === 0 ? "Free" : `₹${plan.price}`}
                </div>
                {plan.price > 0 && (
                  <p className="text-sm text-[#3d2b1f] opacity-60">
                    per {plan.duration}
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="mb-8">
                <h4 className="font-semibold text-[#3d2b1f] mb-4 text-center">
                  What's included:
                </h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-5 h-5 text-[#8b4513] mt-0.5 flex-shrink-0"
                      />
                      <span className="text-[#3d2b1f] text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits Display */}
              <div className="mb-6 p-6 bg-gradient-to-r from-[#fdf7f0] to-[#f5ece3] rounded-xl border border-[#e8dccf]">
                <h5 className="font-semibold text-[#3d2b1f] mb-4 text-center">
                  Pricing Benefits:
                </h5>
                <div className="space-y-2 text-sm text-[#3d2b1f]">
                  {categoryInfo && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          Premium ({categoryInfo.premium.label}):
                        </span>
                        <span className="text-[#8b4513] font-semibold">
                          {plan.benefits.premium}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          Royal ({categoryInfo.royal.label}):
                        </span>
                        <span className="text-[#8b4513] font-semibold">
                          {plan.benefits.royal}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          Luxury ({categoryInfo.luxury.label}):
                        </span>
                        <span className="text-[#8b4513] font-semibold">
                          {plan.benefits.luxury}
                        </span>
                      </div>
                    </>
                  )}
                  {plan.rentalLimit && (
                    <div className="mt-3 pt-3 border-t border-[#e8dccf] text-center">
                      <span className="text-xs text-[#3d2b1f] opacity-60">
                        Rental Limit: {plan.rentalLimit} items/period
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isProcessing || loading || plan.id === planLevel}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${getButtonClass(
                  plan.id
                )}`}
              >
                {isProcessing || loading
                  ? "Processing..."
                  : getButtonText(plan.id)}
              </button>

              {/* Current Plan Indicator */}
              {plan.id === planLevel && (
                <div className="mt-4 text-center">
                  <span className="text-green-600 font-medium text-sm bg-green-50 px-4 py-2 rounded-full border border-green-200">
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4 mr-2" />
                    Active Plan
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d2b1f] mb-4">
            Frequently Asked Questions
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#3d2b1f] to-[#8b4513] mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#e8dccf]">
            <div className="flex items-center gap-3 mb-4">
              <FontAwesomeIcon
                icon={faQuestionCircle}
                className="w-6 h-6 text-[#8b4513]"
              />
              <h3 className="font-semibold text-[#3d2b1f] text-lg">
                How does the pricing work?
              </h3>
            </div>
            <p className="text-[#3d2b1f] opacity-80 leading-relaxed text-sm">
              {categoryInfo &&
                `Products are categorized into Premium (${categoryInfo.premium.label}), Royal (${categoryInfo.royal.label}), and Luxury (${categoryInfo.luxury.label}) based on MRP. Plus and Pro plans offer different discounts for each category.`}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#e8dccf]">
            <div className="flex items-center gap-3 mb-4">
              <FontAwesomeIcon
                icon={faQuestionCircle}
                className="w-6 h-6 text-[#8b4513]"
              />
              <h3 className="font-semibold text-[#3d2b1f] text-lg">
                Can I change my plan anytime?
              </h3>
            </div>
            <p className="text-[#3d2b1f] opacity-80 leading-relaxed text-sm">
              Yes! You can upgrade anytime during your subscription period. To
              cancel, your subscription will end immediately and you'll be moved
              to the free plan.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#e8dccf]">
            <div className="flex items-center gap-3 mb-4">
              <FontAwesomeIcon
                icon={faQuestionCircle}
                className="w-6 h-6 text-[#8b4513]"
              />
              <h3 className="font-semibold text-[#3d2b1f] text-lg">
                How long is the subscription valid?
              </h3>
            </div>
            <p className="text-[#3d2b1f] opacity-80 leading-relaxed text-sm">
              Both Plus and Pro plans are valid for 14 days from activation. You
              can enable auto-renew to automatically continue your benefits.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#e8dccf]">
            <div className="flex items-center gap-3 mb-4">
              <FontAwesomeIcon
                icon={faQuestionCircle}
                className="w-6 h-6 text-[#8b4513]"
              />
              <h3 className="font-semibold text-[#3d2b1f] text-lg">
                What payment methods are accepted?
              </h3>
            </div>
            <p className="text-[#3d2b1f] opacity-80 leading-relaxed text-sm">
              We accept all major payment methods through Razorpay including
              UPI, credit/debit cards, net banking, and digital wallets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
