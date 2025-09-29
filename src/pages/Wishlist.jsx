import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import WishlistButton from '../components/WishlistButton'
import PricingDisplay from '../components/PricingDisplay'
import SubscriptionBadge from '../components/SubscriptionBadge'
import UpgradeBanner from '../components/UpgradeBanner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const Wishlist = () => {
    const { 
        wishlist, 
        getWishlist, 
        removeFromWishlist, 
        token, 
        currency, 
        userType, 
        subscriptionBenefits,
        navigate 
    } = useContext(ShopContext)
    
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (token) {
            getWishlist()
        }
        setIsLoading(false)
    }, [token])

    const handleRemoveFromWishlist = async (productId) => {
        await removeFromWishlist(productId)
    }

    const handleAddToCart = (product) => {
        // Navigate to product page to add to cart with rental details
        navigate(`/product/${product._id}`)
    }

    if (!token) {
        return (
            <div className="min-h-screen bg-[#fdf7f0] py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-[#e8dccf] rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faHeart} className="text-4xl text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#3d2b1f] mb-4">Your Wishlist is Empty</h2>
                        <p className="text-[#3d2b1f] opacity-80 mb-8">Please login to save items to your wishlist</p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="bg-[#3d2b1f] text-[#fdf7f0] px-6 py-3 rounded-lg hover:bg-[#5a3c2c] transition-colors"
                        >
                            Login to Continue
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fdf7f0] py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-[#e8dccf] rounded w-48 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg p-4">
                                    <div className="h-48 bg-[#e8dccf] rounded mb-4"></div>
                                    <div className="h-4 bg-[#e8dccf] rounded mb-2"></div>
                                    <div className="h-4 bg-[#e8dccf] rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='border-t border-[#e8dccf] pt-16 bg-[#fdf7f0] text-[#3d2b1f]'>
            <div className='text-2xl mb-8'>
                <h1 className='font-bold text-[#3d2b1f]'>MY WISHLIST</h1>
            </div>
            
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-[#3d2b1f] opacity-80">
                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>
                <SubscriptionBadge userType={userType} />
            </div>

            {/* Upgrade Banner for Free Users */}
            {userType === 'free' && <UpgradeBanner />}

            {wishlist.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-[#e8dccf] rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faHeart} className="text-4xl text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#3d2b1f] mb-4">Your Wishlist is Empty</h2>
                    <p className="text-[#3d2b1f] opacity-80 mb-8">Save items you love to your wishlist</p>
                    <button 
                        onClick={() => navigate('/collection')}
                        className="bg-[#3d2b1f] text-[#fdf7f0] px-6 py-3 rounded-lg hover:bg-[#5a3c2c] transition-colors"
                    >
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((product) => (
                        <div key={product._id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01] flex flex-col overflow-hidden">
                            {/* Product Image */}
                            <div className="relative w-full h-[280px] overflow-hidden bg-gray-100">
                                <img 
                                    src={product.image[0]} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    draggable={false}
                                />
                                <div className="absolute top-2 right-2 z-10">
                                    <WishlistButton 
                                        productId={product._id} 
                                        size="sm"
                                    />
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 p-4 flex flex-col justify-between min-h-[100px]">
                                <h3 className="text-sm text-[#3d2b1f] font-medium leading-tight truncate mb-2" title={product.name}>
                                    {product.name}
                                </h3>

                                {/* Pricing */}
                                <div className="h-[40px] flex items-center mb-4">
                                    <PricingDisplay 
                                        product={product}
                                        userType={userType}
                                        subscriptionBenefits={subscriptionBenefits}
                                        showOriginalPrice={true}
                                        size="normal"
                                        showSubscriptionBadge={true}
                                        showRentalPrice={false}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1 bg-[#3d2b1f] text-[#fdf7f0] py-2 px-4 rounded-lg hover:bg-[#5a3c2c] transition-colors text-sm font-medium"
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        className="flex-1 border border-[#3d2b1f] text-[#3d2b1f] py-2 px-4 rounded-lg hover:bg-[#e8dccf] transition-colors text-sm font-medium"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Wishlist
