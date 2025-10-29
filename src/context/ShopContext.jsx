import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  // STATE MANAGEMENT
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [cartTotalWithDelivery, setCartTotalWithDelivery] = useState(0);
  // Coupon state (frontend-side cached values)
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponNewSubtotal, setCouponNewSubtotal] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);

  // Add ref to track if logout is already in progress
  const isLoggingOut = useRef(false);

  // AXIOS INSTANCE WITH INTERCEPTOR
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

  const axiosInstance = axios.create({
    baseURL: backendURL,
  });

  // ===== REQUEST INTERCEPTOR =====
  axiosInstance.interceptors.request.use(
    (config) => {
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const logoutUser = useCallback(() => {
    // Prevent multiple simultaneous logout calls
    if (isLoggingOut.current) return;

    isLoggingOut.current = true;

    setToken("");
    setUser(null);
    setSubscription(null);
    setCart([]);
    setCartTotal(0);
    setWishlist([]);
    setBookings([]);
    localStorage.removeItem("token");

    toast.info("Logged out successfully");

    setTimeout(() => {
      isLoggingOut.current = false;
    }, 1000);
  }, []);

  // Add response interceptor for global error handling
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const url = error.config?.url || "";
        const isAuthOperation =
          url.includes("/login") ||
          url.includes("/register") ||
          url.includes("/verify-otp");

        // Only logout for non-auth 401 errors
        if (!isLoggingOut.current) {
          toast.error("Session expired. Please login again.");
          logoutUser();
        }
      }
      return Promise.reject(error);
    }
  );

  // AUTHENTICATION FUNCTIONS
  const registerUser = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/user/register", {
        name,
        email,
        password,
      });

      if (res.data.success) {
        toast.success(res.data.message || "OTP sent to your email!");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
      return res.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration error";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/user/verify-otp", { email, otp });

      if (res.data.success && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        toast.success("Account verified successfully!");
        setTimeout(async () => {
          await Promise.allSettled([
            fetchSubscription(),
            fetchUserProfile(),
            fetchCart(),
            fetchWishlist(),
          ]);
        }, 1000);
        return { success: true };
      } else {
        toast.error(res.data.message || "OTP verification failed");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "OTP verification error";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/user/login", { email, password });

      if (res.data.success && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        toast.success("Login successful!");
        setTimeout(async () => {
          await Promise.allSettled([
            fetchSubscription(),
            fetchUserProfile(),
            fetchCart(),
            fetchWishlist(),
          ]);
        }, 1000);
        return { success: true };
      } else {
        toast.error(res.data.message || "Login failed");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login error";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // ===== USER PROFILE FUNCTIONS =====
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/user/profile");
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  }, []);

  const updateUserProfile = useCallback(async (profileData) => {
    try {
      const res = await axiosInstance.post("/user/update-profile", profileData);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success(res.data.message);
        return { success: true };
      } else {
        toast.error(res.data.message);
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      toast.error("Failed to update profile");
      return { success: false, message: error.message };
    }
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      const res = await axiosInstance.post("/user/change-password", {
        currentPassword,
        newPassword,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        return { success: true };
      } else {
        toast.error(res.data.message);
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      toast.error("Failed to change password");
      return { success: false, message: error.message };
    }
  }, []);

  const deleteUserAccount = useCallback(
    async (password) => {
      try {
        const res = await axiosInstance.delete("/user/delete-account", {
          data: { password },
        });
        if (res.data.success) {
          toast.success(res.data.message);
          logoutUser();
          return { success: true };
        } else {
          toast.error(res.data.message);
          return { success: false, message: res.data.message };
        }
      } catch (error) {
        toast.error("Failed to delete account");
        return { success: false, message: error.message };
      }
    },
    [logoutUser]
  );

  // SUBSCRIPTION FUNCTIONS
  const fetchSubscriptionPlans = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/subscription/plans");
      if (res.data.success) {
        setSubscriptionPlans(res.data.plans || []);
        setCategoryInfo(res.data.categoryInfo || null);
      }
    } catch (error) {
      console.error("Failed to fetch subscription plans:", error);
      toast.error("Failed to load subscription plans");
    }
  }, []);

  const fetchSubscription = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axiosInstance.get("/subscription/me");
      if (res.data.success) {
        setSubscription(res.data.subscription);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    }
  }, [token]);

  const upgradePlan = async (plan) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/subscription/subscribe", { plan });

      if (res.data.success) {
        toast.success(`${plan.toUpperCase()} plan order created!`);
        // normalize response to include `order` object for frontend consumers
        return {
          success: true,
          order: {
            id: res.data.orderId || res.data.order?.id,
            amount: res.data.amount || res.data.order?.amount,
            currency: res.data.currency || res.data.order?.currency || "INR",
            receipt: res.data.bookingReceipt || res.data.order?.receipt,
          },
          raw: res.data,
        };
      } else {
        toast.error(res.data.message || "Failed to create subscription order");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Subscription error";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const verifyPlanPayment = async (payload) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/subscription/verify", payload);

      if (res.data.success) {
        setSubscription(res.data.subscription);
        toast.success("Subscription activated successfully! 🎉");
        return { success: true };
      } else {
        toast.error(res.data.message || "Payment verification failed");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Verification error";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const cancelPlan = async (immediate = false) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/subscription/cancel", {
        immediate,
      });

      if (res.data.success) {
        setSubscription(res.data.subscription);
        toast.success(
          immediate
            ? "Subscription cancelled immediately"
            : "Auto-renewal disabled"
        );
        return { success: true };
      } else {
        toast.error(res.data.message || "Failed to cancel subscription");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Cancellation error";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // PRODUCT FUNCTIONS

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/product/list");
      if (res.data.success) {
        setProducts(res.data.products || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = async (id) => {
    try {
      const res = await axiosInstance.get(`/product/list/${id}`);
      if (!res.data.success) {
        toast.error(res.data.message || "Product not found");
      }
      return res.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch product";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const fetchFilterOptions = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/product/filter-options");
      if (res.data.success) {
        // Backend returns `filterOptions` key
        setFilterOptions(res.data.filterOptions || {});
      }
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    }
  }, []);

  // CART FUNCTIONS

  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axiosInstance.get("/cart");
      if (res.data.success) {
        setCart(res.data.cart || []);
        setCartTotal(res.data.total || 0);
        setDeliveryFee(res.data.deliveryFee || 0);
        // prefer backend's totalWithDelivery if present, otherwise compute
        setCartTotalWithDelivery(
          res.data.totalWithDelivery ||
            (res.data.total || 0) + (res.data.deliveryFee || 0)
        );
        // reset coupon when fetching cart (so UI stays consistent)
        setCouponCode("");
        setCouponDiscount(0);
        setCouponNewSubtotal(null);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }, [token]);

  const addToCart = async (productId, size, duration, startDate) => {
    try {
      if (!startDate) {
        toast.error("Please select a start date");
        return { success: false, message: "Start date is required" };
      }

      setLoading(true);
      const res = await axiosInstance.post("/cart/add", {
        productId,
        size,
        duration,
        startDate,
      });

      if (res.data.success) {
        await fetchCart();
        toast.success("Item added to cart!");
        return { success: true };
      } else {
        toast.error(res.data.message || "Failed to add to cart");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error adding to cart";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Apply coupon code (calls backend /coupon/apply)
  const applyCoupon = async (code) => {
    try {
      if (!code) return { success: false, message: "Coupon code required" };
      setLoading(true);
      const res = await axiosInstance.post("/coupon/apply", {
        code,
        subtotal: cartTotal,
      });

      if (res.data.success) {
        const discount = res.data.discountAmount || 0;
        const newSubtotal = res.data.newTotal;
        setCouponCode(res.data.coupon?.code || String(code).toUpperCase());
        setCouponDiscount(discount);
        setCouponNewSubtotal(newSubtotal);
        // also update totalWithDelivery using current deliveryFee
        setCartTotalWithDelivery(
          Math.round((newSubtotal + (deliveryFee || 0)) * 100) / 100
        );
        return { success: true, discount, newSubtotal };
      } else {
        // clear coupon state on failure
        setCouponCode("");
        setCouponDiscount(0);
        setCouponNewSubtotal(null);
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      console.error("applyCoupon error:", error);
      setCouponCode("");
      setCouponDiscount(0);
      setCouponNewSubtotal(null);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const clearCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponNewSubtotal(null);
    // restore cart total with delivery
    setCartTotalWithDelivery((cartTotal || 0) + (deliveryFee || 0));
  };

  const removeFromCart = async (productId, size, duration, startDate) => {
    try {
      const res = await axiosInstance.delete(`/cart/remove/${productId}`, {
        data: { size, duration, startDate },
      });

      if (res.data.success) {
        await fetchCart();
        toast.success("Item removed from cart");
        return { success: true };
      } else {
        toast.error(res.data.message || "Failed to remove item");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error removing item";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const clearCart = async () => {
    try {
      const res = await axiosInstance.delete("/cart/clear");

      if (res.data.success) {
        setCart([]);
        setCartTotal(0);
        toast.success("Cart cleared");
      } else {
        toast.error(res.data.message || "Failed to clear cart");
      }
      return res.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error clearing cart";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // WISHLIST FUNCTIONS

  const fetchWishlist = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axiosInstance.get("/wishlist/get");
      if (res.data.success) {
        setWishlist(res.data.wishlist || []);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  }, [token]);

  const addToWishlist = useCallback(async (productId) => {
    try {
      const res = await axiosInstance.post("/wishlist/add", { productId });
      if (res.data.success) {
        await fetchWishlist(); // Refresh wishlist
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to add to wishlist");
    }
  }, []);

  const removeFromWishlist = useCallback(async (productId) => {
    try {
      const res = await axiosInstance.post("/wishlist/remove", { productId });
      if (res.data.success) {
        await fetchWishlist(); // Refresh wishlist
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  }, []);

  const checkWishlistStatus = async (productIds) => {
    try {
      const res = await axiosInstance.post("/wishlist/status", { productIds });
      return res.data;
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
      return { success: false, inWishlist: {} };
    }
  };

  // BOOKING FUNCTIONS

  const fetchBookings = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axiosInstance.get("/booking/my");
      if (res.data.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  }, [token]);

  // ShopContext.jsx

  const createBooking = async (cartItems, address, couponOverride) => {
    try {
      setLoading(true);
      const payload = { cartItems, address };
      const couponToSend = couponOverride || couponCode;
      if (couponToSend) payload.couponCode = couponToSend;

      const res = await axiosInstance.post("/booking/create", payload);

      if (res.data.success) {
        // Return backend payload more directly so caller can access delivery fee / total
        return {
          success: true,
          order: res.data.order || {
            id: res.data.orderId,
            amount: res.data.amount,
            currency: res.data.currency || "INR",
          },
          bookingId: res.data.bookingId,
          deliveryFee: res.data.deliveryFee,
          totalPrice: res.data.totalPrice,
        };
      } else {
        toast.error(res.data.message || "Failed to create booking");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Booking creation error";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const verifyBooking = async (payload) => {
    try {
      setLoading(true);

      // payload may include bookingId (if booking was pre-created) OR
      // include cartItems + address when booking is created after payment.
      const res = await axiosInstance.post("/booking/verify", payload);

      if (res.data.success) {
        await Promise.all([fetchBookings(), fetchCart()]);
        toast.success("Booking confirmed! 🎉");
        return { success: true };
      } else {
        toast.error(res.data.message || "Payment verification failed");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Verification error";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // DERIVED VALUES

  const planLevel = subscription?.plan || "free";
  const isPremiumUser = planLevel === "plus" || planLevel === "pro";
  const isAdmin = user?.role === "admin";

  // INITIAL LOAD

  useEffect(() => {
    fetchProducts();
    fetchFilterOptions();
    fetchSubscriptionPlans();
  }, [fetchProducts, fetchFilterOptions, fetchSubscriptionPlans]);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // On initial mount with existing token, fetch user data
      if (token) {
        setTimeout(async () => {
          await Promise.allSettled([
            fetchSubscription(),
            fetchUserProfile(),
            fetchCart(),
            fetchWishlist(),
            fetchBookings(),
          ]);
        }, 100);
      }
    }
  }, []);

  // CONTEXT VALUE
  const contextValue = {
    // Auth
    token,
    user,
    setUser,
    loginUser,
    registerUser,
    verifyOTP,
    logoutUser,
    fetchUserProfile,
    updateUserProfile,
    changePassword,
    deleteUserAccount,
    isAdmin,

    // Subscription
    subscription,
    planLevel,
    isPremiumUser,
    fetchSubscription,
    upgradePlan,
    verifyPlanPayment,
    cancelPlan,
    subscriptionPlans,
    categoryInfo,
    fetchSubscriptionPlans,

    // Products
    products,
    filterOptions,
    fetchProducts,
    fetchProductById,
    fetchFilterOptions,

    // Cart
    cart,
    cartTotal,
    deliveryFee,
    cartTotalWithDelivery,
    // Coupons
    couponCode,
    couponDiscount,
    couponNewSubtotal,
    applyCoupon,
    clearCoupon,
    addToCart,
    removeFromCart,
    clearCart,
    fetchCart,

    // Wishlist
    wishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlistStatus,
    fetchWishlist,

    // Bookings
    bookings,
    fetchBookings,
    createBooking,
    verifyBooking,

    // UI State
    loading,
    setLoading,
  };

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
