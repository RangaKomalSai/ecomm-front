import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faUser,
  faCalendar,
  faCrown,
  faShoppingBag,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const PlaceOrder = () => {
  const {
    token,
    cart,
    cartTotal,
    deliveryFee,
    cartTotalWithDelivery,
    couponCode,
    couponDiscount,
    user,
    planLevel,
    subscription,
    createBooking,
    verifyBooking,
    loading,
  } = useContext(ShopContext);

  const navigate = useNavigate();

  // Form state
  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Store bookingId in ref
  const bookingIdRef = useRef(null);

  // Indian states
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      toast.info("Please login to place order");
      navigate("/login");
    }
  }, [token, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (token && (!cart || cart.length === 0)) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [cart, token, navigate]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateAddress = () => {
    if (!address.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!address.phone || address.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!address.street.trim()) {
      toast.error("Please enter street address");
      return false;
    }
    if (!address.city.trim()) {
      toast.error("Please enter city");
      return false;
    }
    if (!address.state) {
      toast.error("Please select state");
      return false;
    }
    if (!address.pincode || address.pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit PIN code");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) {
      toast.error("Order is already being processed");
      return;
    }

    if (!validateAddress()) {
      return;
    }

    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Prepare cart items for booking
      const cartItems = cart.map((item) => ({
        productId: item.product._id,
        size: item.size,
        duration: item.duration,
        quantity: item.quantity || 1,
        startDate: item.startDate,
        endDate: item.endDate,
      }));

      // Create booking order (include coupon if applied)
      const bookingResponse = await createBooking(
        cartItems,
        address,
        couponCode
      );

      if (!bookingResponse.success) {
        setIsPlacingOrder(false);
        return;
      }

      // Store bookingId
      bookingIdRef.current = bookingResponse.bookingId;

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Open Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: bookingResponse.order.amount,
        currency: bookingResponse.order.currency || "INR",
        name: "Fashion Rental Platform",
        description: "Rental Booking Payment",
        order_id: bookingResponse.order.id,
        handler: async function (response) {
          await handlePaymentSuccess({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: address.name,
          contact: address.phone,
        },
        theme: {
          color: "#3d2b1f",
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled. You can try again from your cart.");
            bookingIdRef.current = null;
            setIsPlacingOrder(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        bookingIdRef.current = null;
        setIsPlacingOrder(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Place order error:", error);
      toast.error("Failed to place order");
      bookingIdRef.current = null;
      setIsPlacingOrder(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    try {

      // ✅ Validate payment response
      if (
        !paymentResponse.razorpay_order_id ||
        !paymentResponse.razorpay_payment_id ||
        !paymentResponse.razorpay_signature
      ) {
        console.error("Invalid payment response:", paymentResponse);
        toast.error("Invalid payment response received");
        setIsPlacingOrder(false);
        return;
      }

      // ✅ Validate bookingId exists
      // Build verification payload. If we have a bookingId (old flow), send it;
      // otherwise send cartItems + address so backend can create the booking after verification.
      const payload = {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      };

      if (bookingIdRef.current) {
        payload.bookingId = bookingIdRef.current;
      } else {
        // send cart items and address for booking creation
        payload.cartItems = cart.map((item) => ({
          productId: item.product._id,
          size: item.size,
          duration: item.duration,
          quantity: item.quantity || 1,
          startDate: item.startDate,
          endDate: item.endDate,
        }));
        payload.address = address;
        if (couponCode) payload.couponCode = couponCode;
      }

      // ✅ Send to backend for verification (will create booking if needed)
      const result = await verifyBooking(payload);

      if (result.success) {
        bookingIdRef.current = null;
        // Navigate to orders page
        navigate("/orders");
      } else {
        console.error("Verification failed:", result);
        toast.error(result.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error("Payment verification failed");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading || !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf7f0]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2b1f]"></div>
          <p className="text-[#3d2b1f]">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf7f0] py-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#e8dccf] bg-white text-[#3d2b1f] hover:bg-gray-50 transition-colors"
            aria-label="Go back"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <h1 className="text-3xl font-bold text-[#3d2b1f]">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-[#e8dccf] p-6">
              <h2 className="text-xl font-bold text-[#3d2b1f] mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                Delivery Address
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={address.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg focus:border-[#3d2b1f] focus:outline-none"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
                    <FontAwesomeIcon icon={faPhone} className="mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    maxLength="10"
                    className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg focus:border-[#3d2b1f] focus:outline-none"
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>

                {/* Street */}
                <div>
                  <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
                    Street Address *
                  </label>
                  <textarea
                    name="street"
                    value={address.street}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg focus:border-[#3d2b1f] focus:outline-none resize-none"
                    placeholder="House number, building name, street"
                    required
                  />
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={address.landmark}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg focus:border-[#3d2b1f] focus:outline-none"
                    placeholder="Near temple, mall, etc."
                  />
                </div>

                {/* City and State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg focus:border-[#3d2b1f] focus:outline-none"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
                      State *
                    </label>
                    <select
                      name="state"
                      value={address.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg focus:border-[#3d2b1f] focus:outline-none"
                      required
                    >
                      <option value="">Select State</option>
                      {indianStates.map((state, index) => (
                        <option key={index} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PIN Code */}
                <div>
                  <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleInputChange}
                    maxLength="6"
                    className="w-full px-4 py-3 border-2 border-[#e8dccf] rounded-lg focus:border-[#3d2b1f] focus:outline-none"
                    placeholder="6-digit PIN code"
                    required
                  />
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>📦 Delivery Information:</strong>
                  <br />
                  Items will be delivered as per the start date selected for
                  each product.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-[#e8dccf] p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#3d2b1f] mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faShoppingBag} />
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {cart.map((item, index) => {
                  const product = item.product;
                  if (!product) return null;

                  return (
                    <div
                      key={index}
                      className="flex gap-3 pb-4 border-b border-[#e8dccf]"
                    >
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-[#3d2b1f] line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Size: {item.size} | {item.duration} days
                        </p>
                        <p className="text-sm font-semibold text-[#3d2b1f] mt-1">
                          ₹{item.priceAtTime}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="pt-4 border-t-2 border-[#e8dccf] space-y-2 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{cartTotal || 0}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee && deliveryFee > 0
                      ? `₹${deliveryFee}`
                      : "FREE"}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>- ₹{couponDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-xl font-bold text-[#3d2b1f]">
                  <span>Total Amount</span>
                  <span>
                    ₹
                    {cartTotalWithDelivery ||
                      (couponDiscount > 0
                        ? (cartTotal || 0) - couponDiscount + (deliveryFee || 0)
                        : (cartTotal || 0) + (deliveryFee || 0))}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !cart || cart.length === 0}
                className="w-full py-4 bg-[#3d2b1f] text-white font-bold rounded-lg hover:bg-[#5a3c2c] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isPlacingOrder ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </span>
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
