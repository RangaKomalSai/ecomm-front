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
                    console.log('API call failed, but booking created locally:', apiError);
                }
            }

            toast.success('Booking created successfully!');
            return booking;
        } catch (error) {
            console.error('Error creating booking:', error);
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

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, rentalData }, { headers: { token } })
            } catch (error) {
                console.log(error)
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

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, rentalData }, { headers: { token } })
            } catch (error) {
                console.log(error)
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

    const getProductsData = async () => {
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products.reverse())
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async ( token ) => {
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
        }
    }, [token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateRentalData,
        getCartAmount, navigate, backendUrl,
        setToken, token, createBooking, bookings, orders
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;