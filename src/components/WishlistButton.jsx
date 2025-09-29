import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'

const WishlistButton = ({ productId, className = "", size = "sm" }) => {
    const { token, wishlistStatus, toggleWishlist, checkWishlistStatus } = useContext(ShopContext)
    const [isInWishlist, setIsInWishlist] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (token && productId) {
            // Check if we already have the status cached
            if (wishlistStatus[productId] !== undefined) {
                setIsInWishlist(wishlistStatus[productId])
            } else {
                // Fetch the status if not cached
                checkWishlistStatus(productId).then(status => {
                    setIsInWishlist(status)
                })
            }
        } else {
            setIsInWishlist(false)
        }
    }, [token, productId, wishlistStatus])

    const handleToggleWishlist = async () => {
        if (!token) {
            return
        }

        setIsLoading(true)
        try {
            await toggleWishlist(productId)
            setIsInWishlist(!isInWishlist)
        } catch (error) {
            // Error toggling wishlist
        } finally {
            setIsLoading(false)
        }
    }

    if (!token) {
        return null // Don't show wishlist button for non-logged-in users
    }

    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12"
    }

    const iconSizes = {
        sm: "text-sm",
        md: "text-base", 
        lg: "text-lg"
    }

    return (
        <button
            onClick={handleToggleWishlist}
            disabled={isLoading}
            className={`
                ${sizeClasses[size]} 
                ${iconSizes[size]}
                flex items-center justify-center
                rounded-full border-2 transition-all duration-200
                hover:scale-110 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isInWishlist 
                    ? 'bg-red-500 border-red-500 text-white hover:bg-red-600' 
                    : 'bg-white border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-500'
                }
                ${className}
            `}
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <FontAwesomeIcon 
                icon={isInWishlist ? faHeart : faHeartRegular} 
                className={isLoading ? 'animate-pulse' : ''}
            />
        </button>
    )
}

export default WishlistButton
