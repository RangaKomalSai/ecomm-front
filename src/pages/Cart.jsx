import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import PricingDisplay from "../components/PricingDisplay";

const Cart = () => {
  const {
    cart,
    cartTotal,
    removeFromCart,
    fetchCart,
    token,
    planLevel,
    subscription,
    loading,
  } = useContext(ShopContext);
  const {
    deliveryFee,
    cartTotalWithDelivery,
    couponCode,
    couponDiscount,
    couponNewSubtotal,
    applyCoupon,
    clearCoupon,
  } = useContext(ShopContext);
  const [couponInput, setCouponInput] = useState(couponCode || "");

  const navigate = useNavigate();
  const currency = "₹";

  // Load cart on mount
  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const handleRemoveItem = async (productId, size, duration) => {
    await removeFromCart(productId, size, duration);
  };

  const handleCheckout = () => {
    if (!token) {
      toast.info("Please login to proceed with checkout");
      navigate("/login");
      return;
    }

    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    navigate("/place-order");
  };

  // Get duration text
  const getDurationText = (duration) => {
    if (duration === 1) return "1 day";
    return `${duration} days`;
  };

  // Calculate savings
  const calculateSavings = () => {
    if (!cart || cart.length === 0) return 0;

    let originalTotal = 0;
    let discountedTotal = 0;

    cart.forEach((item) => {
      const product = item.product;
      if (!product) return;

      // Get base price based on duration
      let basePrice = 0;
      switch (item.duration) {
        case 2:
          basePrice = product.twoDayRentalPrice || 0;
          break;
        case 4:
          basePrice = product.fourDayRentalPrice || 0;
          break;
        case 7:
          basePrice = product.sevenDayRentalPrice || 0;
          break;
        case 14:
          basePrice = product.fourteenDayRentalPrice || 0;
          break;
        default:
          basePrice = product.twoDayRentalPrice || 0;
      }

      originalTotal += basePrice * (item.quantity || 1);
      discountedTotal += (item.priceAtTime || basePrice) * (item.quantity || 1);
    });

    return originalTotal - discountedTotal;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf7f0] to-[#f8f4f0] py-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#3d2b1f] mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cart && cart.length > 0
              ? `${cart.length} ${
                  cart.length === 1 ? "item" : "items"
                } in your cart`
              : "Your cart is empty"}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2b1f]"></div>
          </div>
        )}

        {/* Empty Cart */}
        {!loading && (!cart || cart.length === 0) && (
          <div className="bg-white rounded-xl shadow-lg border border-[#e8dccf] p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <img
                src={assets.cart_icon}
                className="w-12 h-12 opacity-40"
                alt="Empty cart"
              />
            </div>
            <h2 className="text-2xl font-semibold text-[#3d2b1f] mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some rental items to get started
            </p>
            <button
              onClick={() => navigate("/collection")}
              className="bg-[#3d2b1f] text-white px-8 py-3 rounded-lg hover:bg-[#5a3c2c] transition-colors font-medium"
            >
              Browse Collection
            </button>
          </div>
        )}

        {/* Cart Items */}
        {!loading && cart && cart.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => {
                const product = item.product;
                if (!product) return null;

                return (
                  <div
                    key={`${product._id}-${item.size}-${item.duration}-${index}`}
                    className="bg-white rounded-xl shadow-md border border-[#e8dccf] p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div
                        className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <img
                          src={product.images?.[0] || assets.placeholder}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg hover:opacity-75 transition-opacity"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3
                              className="font-semibold text-lg text-[#3d2b1f] mb-1 cursor-pointer hover:text-[#5a3c2c] transition-colors"
                              onClick={() =>
                                navigate(`/product/${product._id}`)
                              }
                            >
                              {product.name}
                            </h3>

                            {/* Category & Product ID */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              {product.category && (
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium capitalize">
                                  {product.category}
                                </span>
                              )}
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {product.productId}
                              </span>
                            </div>

                            {/* Size & Duration */}
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                              {item.size && (
                                <span className="flex items-center gap-1">
                                  <strong>Size:</strong> {item.size}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <strong>Duration:</strong>{" "}
                                {getDurationText(item.duration)}
                              </span>
                              {item.quantity > 1 && (
                                <span className="flex items-center gap-1">
                                  <strong>Qty:</strong> {item.quantity}
                                </span>
                              )}
                            </div>

                            {/* Display rental period */}
                            <div className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">
                                Rental Period:
                              </span>
                              <br />
                              <span>
                                {new Date(item.startDate).toLocaleDateString(
                                  "en-IN"
                                )}
                                {" → "}
                                {new Date(item.endDate).toLocaleDateString(
                                  "en-IN"
                                )}
                              </span>
                              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                {item.duration} days
                              </span>
                            </div>

                            {/* Pricing Display */}
                            <div className="mb-3">
                              <PricingDisplay
                                product={product}
                                subscription={subscription}
                                planLevel={planLevel}
                                rentalDays={item.duration}
                                size="normal"
                                showOriginalPrice={true}
                                showSubscriptionBadge={true}
                                showMRP={false}
                              />
                            </div>

                            {/* Total Price for this item */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                Item Total:
                              </span>
                              <span className="text-lg font-bold text-[#3d2b1f]">
                                {currency}
                                {(item.priceAtTime || 0) * (item.quantity || 1)}
                              </span>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() =>
                              handleRemoveItem(
                                product._id,
                                item.size,
                                item.duration,
                                item.startDate
                              )
                            }
                            className="ml-4 text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            title="Remove from cart"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-[#e8dccf] p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#3d2b1f] mb-6 pb-3 border-b border-[#e8dccf]">
                  Order Summary
                </h2>

                {/* Subscription Badge */}
                {planLevel !== "free" && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-amber-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-700 font-semibold text-sm capitalize">
                        {planLevel} Plan Active
                      </span>
                      <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                        ✓
                      </span>
                    </div>
                    <p className="text-xs text-purple-600">
                      Enjoying exclusive rental benefits!
                    </p>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  {/* Subtotal */}
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      {currency}
                      {cartTotal || 0}
                    </span>
                  </div>

                  {/* Savings */}
                  {calculateSavings() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Savings</span>
                      <span className="font-medium">
                        - {currency}
                        {calculateSavings()}
                      </span>
                    </div>
                  )}

                  {/* Delivery */}
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery</span>
                    <span className="font-medium text-green-600">
                      {deliveryFee && deliveryFee > 0 ? (
                        <>
                          {currency}
                          {deliveryFee}
                        </>
                      ) : (
                        "FREE"
                      )}
                    </span>
                  </div>

                  {/* Coupon input */}
                  <div className="flex gap-2 items-center w-full">
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter coupon code"
                        className="w-full min-w-0 border px-3 py-2 rounded"
                      />
                    </div>
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        const result = await applyCoupon(couponInput);
                        if (result && result.success) {
                          toast.success(`Coupon applied: -₹${result.discount}`);
                        } else {
                          toast.error(result.message || "Invalid coupon");
                        }
                      }}
                      className="bg-black text-white px-3 py-2 rounded flex-shrink-0"
                    >
                      Apply
                    </button>
                    {/*
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        clearCoupon();
                        setCouponInput("");
                        toast.info("Coupon cleared");
                      }}
                      className="bg-gray-200 text-gray-800 px-3 py-2 rounded flex-shrink-0"
                    >
                      Clear
                    </button>
                    */}
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span className="font-medium">
                        - {currency}
                        {couponDiscount}
                      </span>
                    </div>
                  )}

                  <hr className="border-[#e8dccf]" />

                  {/* Total */}
                  <div className="flex justify-between text-xl font-bold text-[#3d2b1f]">
                    <span>Total</span>
                    <span>
                      {currency}
                      {cartTotalWithDelivery ||
                        (cartTotal || 0) + (deliveryFee || 0)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#3d2b1f] text-white py-3 rounded-lg font-semibold hover:bg-[#5a3c2c] active:scale-95 transition-all shadow-md"
                >
                  Proceed to Checkout
                </button>

                {/* Security Info */}
                <div className="mt-6 pt-6 border-t border-[#e8dccf]">
                  <div className="flex items-start gap-3 text-xs text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        Secure Checkout
                      </p>
                      <p>Your payment information is encrypted and secure</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Banner for Free Users */}
        {!loading && cart && cart.length > 0 && planLevel === "free" && (
          <div className="mt-8 bg-gradient-to-r from-purple-50 via-amber-50 to-purple-50 border-2 border-purple-200 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-purple-800 mb-2">
                  💎 Unlock Premium Benefits
                </h3>
                <p className="text-purple-700 mb-3">
                  Upgrade to Plus or Pro plan to enjoy free rentals on premium
                  items and exclusive discounts!
                </p>
                <ul className="text-sm text-purple-600 space-y-1">
                  <li>✓ Free rentals on Premium category items</li>
                  <li>✓ 50% off on Royal category items (Plus)</li>
                  <li>✓ Extended 14-day rental periods</li>
                </ul>
              </div>
              <button
                onClick={() => navigate("/subscription-plans")}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors whitespace-nowrap"
              >
                View Plans
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
