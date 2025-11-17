import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'Rs.';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [orders, setOrders] = useState([]);
    const [token, setToken] = useState('')
    const [userId, setUserId] = useState('')
    const [userType, setUserType] = useState('free')
    const [subscriptionBenefits, setSubscriptionBenefits] = useState({})
    const [subscriptionPlans, setSubscriptionPlans] = useState([])
    const [wishlist, setWishlist] = useState([])
    const [wishlistStatus, setWishlistStatus] = useState({})
    const [filterOptions, setFilterOptions] = useState({})
    const navigate = useNavigate();

    const createBooking = async ({ listingId, renterId, startDate, endDate, totalPrice, deliveryETA }) => {
        try {
            const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const booking = {
                id: bookingId,
                listingId,
                renterId,
                startDate,
                endDate,
                totalPrice,
                deliveryETA: deliveryETA || Date.now() + 30*60*1000, // Default express delivery
                status: 'booked',
                createdAt: new Date().toISOString()
            };

            // Update local state immediately
            setBookings(prev => [...prev, booking]);
            
            // Create corresponding order
            const order = {
                id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                bookingId,
                items: [{
                    listingId,
                    startDate,
                    endDate,
                    totalPrice
                }],
                totalAmount: totalPrice,
                status: 'confirmed',
                paymentMethod: 'razorpay',
                createdAt: new Date().toISOString()
            };
            
            setOrders(prev => [...prev, order]);

            // Call API (mock for now - replace with actual API call)
            if (backendUrl) {
                try {
                    await axios.post(backendUrl + '/api/booking/create', booking, { headers: { token } });
                } catch (apiError) {
                    // API call failed, but booking created locally
                }
            }

            toast.success('Booking created successfully!');
            return booking;
        } catch (error) {
            toast.error('Failed to create booking. Please try again.');
            throw error;
        }
    };

    const addToCart = async (itemId, rentalData) => {

        if (!rentalData) {
            toast.error('Please select rental details');
            return;
        }

        let cartData = structuredClone(cartItems);

        // Add rental item to cart
        cartData[itemId] = {
            itemId: itemId,
            rentalData: rentalData
        };

        setCartItems(cartData);

        // Only sync with backend if user is logged in
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, rentalData }, { headers: { token } })
            } catch (error) {
                toast.error(error.message)
            }
        }

        toast.success('Rental item added to cart!');
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            // All items are rental items
            if (cartItems[items] && cartItems[items].rentalData) {
                totalCount += 1; // Each rental item counts as 1
            }
        }
        return totalCount;
    }

    const updateRentalData = async (itemId, rentalData) => {

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId].rentalData = rentalData;
        }

        setCartItems(cartData)

        // Only sync with backend if user is logged in
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, rentalData }, { headers: { token } })
            } catch (error) {
                toast.error(error.message)
            }
        }

    }

    const removeFromCart = async (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            delete cartData[itemId];
        }

        setCartItems(cartData)

        // Only sync with backend if user is logged in
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/remove', { itemId }, { headers: { token } })
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            // All items are rental items
            if (cartItems[items] && cartItems[items].rentalData) {
                totalAmount += cartItems[items].rentalData.totalPrice;
            }
        }
        return totalAmount;
    }

    const getProductsData = async (gender = null) => {
        try {
            // Include auth token in headers if user is logged in
            const headers = token ? { token } : {};
            // Add gender query parameter if provided
            const params = gender ? { gender } : {};
            const response = await axios.get(backendUrl + '/api/product/list', { 
                headers,
                params 
            })
            if (response.data.success) {
                setProducts(response.data.products.reverse())
                // Store filter options from backend
                if (response.data.filterOptions) {
                    setFilterOptions(response.data.filterOptions)
                }
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserCart = async ( token ) => {
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                // Convert array to object format for frontend consistency
                const cartDataArray = response.data.cartData || [];
                const cartDataObject = {};
                cartDataArray.forEach(item => {
                    cartDataObject[item.itemId] = item;
                });
                setCartItems(cartDataObject)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserIdFromToken = (token) => {
        try {
            if (!token) return null
            const payload = JSON.parse(atob(token.split('.')[1]))
            return payload.id
        } catch (error) {
            return null
        }
    }

    // Get subscription plans
    const getSubscriptionPlans = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/subscription/plans')
            if (response.data.success) {
                setSubscriptionPlans(response.data.plans)
            }
        } catch (error) {
            // Error fetching subscription plans
        }
    }

    // Get user subscription status
    const getSubscriptionStatus = async (userToken) => {
        try {
            if (!userToken) {
                setUserType('free')
                setSubscriptionBenefits({})
                return
            }

            const response = await axios.get(backendUrl + '/api/subscription/status', {
                headers: { token: userToken }
            })
            if (response.data.success) {
                setUserType(response.data.userType)
                setSubscriptionBenefits(response.data.benefits)
            } else {
                setUserType('free')
                setSubscriptionBenefits({})
            }
        } catch (error) {
            setUserType('free')
            setSubscriptionBenefits({})
        }
    }

    // Upgrade subscription
    const upgradeSubscription = async (newUserType) => {
        try {
            const response = await axios.post(backendUrl + '/api/subscription/upgrade', 
                { newUserType }, 
                { headers: { token } }
            )
            if (response.data.success) {
                setUserType(newUserType)
                setSubscriptionBenefits(response.data.benefits)
                // Refresh products with new subscription pricing
                getProductsData()
                toast.success(`Subscription upgraded to ${newUserType}`)
                return true
            } else {
                toast.error(response.data.message)
                return false
            }
        } catch (error) {
            toast.error('Failed to upgrade subscription')
            return false
        }
    }

    // Wishlist functions
    const addToWishlist = async (productId) => {
        if (!token) {
            toast.error('Please login to add items to wishlist');
            return;
        }

        try {
            const response = await axios.post(backendUrl + '/api/wishlist/add', 
                { productId }, 
                { headers: { token } }
            );
            
            if (response.data.success) {
                // Update local wishlist status
                setWishlistStatus(prev => ({
                    ...prev,
                    [productId]: true
                }));
                // Refresh wishlist to update count
                await getWishlist();
                toast.success('Added to wishlist');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to add to wishlist');
        }
    }

    const removeFromWishlist = async (productId) => {
        if (!token) {
            toast.error('Please login to manage wishlist');
            return;
        }

        try {
            const response = await axios.post(backendUrl + '/api/wishlist/remove', 
                { productId }, 
                { headers: { token } }
            );
            
            if (response.data.success) {
                // Update local wishlist status
                setWishlistStatus(prev => ({
                    ...prev,
                    [productId]: false
                }));
                // Remove from local wishlist array
                setWishlist(prev => prev.filter(item => item._id !== productId));
                // Refresh wishlist to update count
                await getWishlist();
                toast.success('Removed from wishlist');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to remove from wishlist');
        }
    }

    const getWishlist = async () => {
        if (!token) return;

        try {
            const response = await axios.get(backendUrl + '/api/wishlist/get', 
                { headers: { token } }
            );
            
            if (response.data.success) {
                setWishlist(response.data.wishlist);
            }
        } catch (error) {
            // Error fetching wishlist
        }
    }

    const checkWishlistStatus = async (productId) => {
        if (!token) return false;

        try {
            const response = await axios.get(backendUrl + `/api/wishlist/check/${productId}`, 
                { headers: { token } }
            );
            
            if (response.data.success) {
                return response.data.isInWishlist;
            }
        } catch (error) {
            // Error checking wishlist status
        }
        return false;
    }

    const getBulkWishlistStatus = async (productIds) => {
        if (!token || !productIds.length) return;

        try {
            const response = await axios.post(backendUrl + '/api/wishlist/bulk-check', 
                { productIds }, 
                { headers: { token } }
            );
            
            if (response.data.success) {
                setWishlistStatus(response.data.wishlistStatus);
            }
        } catch (error) {
            // Error fetching bulk wishlist status
        }
    }

    // Load wishlist status for all products when user logs in
    const loadWishlistStatusForProducts = async () => {
        if (!token || !products.length) return;
        
        const productIds = products.map(product => product._id);
        await getBulkWishlistStatus(productIds);
    }

    const toggleWishlist = async (productId) => {
        const isInWishlist = wishlistStatus[productId];
        if (isInWishlist) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    }

    useEffect(() => {
        getProductsData()
        getSubscriptionPlans()
    }, [])

    // Load wishlist status when products are loaded and user is logged in
    useEffect(() => {
        if (token && products.length > 0) {
            loadWishlistStatusForProducts()
        }
    }, [products, token])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            const storedToken = localStorage.getItem('token')
            setToken(storedToken)
            setUserId(getUserIdFromToken(storedToken))
            getUserCart(storedToken)
            getSubscriptionStatus(storedToken)
            getWishlist()
            // Refresh products with new auth
            getProductsData()
        }
        if (token) {
            setUserId(getUserIdFromToken(token))
            getUserCart(token)
            getSubscriptionStatus(token)
            getWishlist()
            // Refresh products with new auth
            getProductsData()
        } else {
            // If no token, set to free user
            setUserType('free')
            setSubscriptionBenefits({})
            setWishlist([])
            setWishlistStatus({})
            // Refresh products as free user
            getProductsData()
        }
    }, [token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateRentalData, removeFromCart,
        getCartAmount, navigate, backendUrl,
        setToken, token, userId, createBooking, bookings, orders,
        userType, subscriptionBenefits, subscriptionPlans,
        getSubscriptionStatus, upgradeSubscription, getSubscriptionPlans,
        wishlist, wishlistStatus, addToWishlist, removeFromWishlist,
        getWishlist, toggleWishlist, checkWishlistStatus, getBulkWishlistStatus,
        loadWishlistStatusForProducts, filterOptions
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;
