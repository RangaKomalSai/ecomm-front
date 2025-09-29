import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const PricingDisplay = ({ 
    product, 
    showOriginalPrice = true, 
    showSubscriptionBadge = true,
    showMRP = false, // Only show MRP on product detail page
    showRentalPrice = true, // Show rental price (false for collection/home pages)
    size = 'normal' // 'small', 'normal', 'large'
}) => {
    const { currency, userType, subscriptionBenefits } = useContext(ShopContext);

    if (!product) return null;


    const isFree = product.isFree || product.rentalPricePerDay === 0;
    const hasDiscount = product.discountType && product.originalPrice && product.originalPrice > product.rentalPricePerDay;
    const isLoggedIn = userType !== 'free' || (userType === 'free' && product.userType);

    // Size classes
    const sizeClasses = {
        small: {
            price: 'text-sm font-medium',
            original: 'text-xs text-gray-400',
            badge: 'text-xs px-1 py-0.5',
            container: 'flex items-center gap-1'
        },
        normal: {
            price: 'text-base font-medium',
            original: 'text-sm text-gray-400',
            badge: 'text-xs px-2 py-1',
            container: 'flex items-center gap-2'
        },
        large: {
            price: 'text-xl font-medium',
            original: 'text-base text-gray-400',
            badge: 'text-sm px-3 py-1',
            container: 'flex items-center gap-3'
        }
    };

    const classes = sizeClasses[size];

    // If showRentalPrice is false, show MRP instead
    if (!showRentalPrice) {
        return (
            <div className="flex flex-col gap-1">
                <div className={classes.container}>
                    <span className={classes.price}>
                        {currency}{product.mrp}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1">
            {/* MRP Display - Only on product detail page */}
            {showMRP && product.mrp && (
                <div className="flex items-center gap-2">
                    <span className={`text-lg font-medium text-gray-600`}>
                        MRP: {currency}{product.mrp}
                    </span>
                </div>
            )}
            
            {/* Rental Price Display */}
            <div className={classes.container}>
                {/* Free Users - Show full price */}
                {userType === 'free' && (
                    <div className="flex items-center gap-2">
                        <span className={classes.price}>
                            {currency}{product.rentalPricePerDay}
                            <span className="text-xs text-gray-500">/day</span>
                        </span>
                    </div>
                )}

                {/* Plus Users */}
                {userType === 'plus' && (
                    <div className="flex items-center gap-2">
                        {product.tier === 'premium' ? (
                            // Premium items are free for Plus users
                            <div className="flex items-center gap-2">
                                <span className={`${classes.price} text-green-600`}>Free</span>
                                {showOriginalPrice && (
                                    <span className={`${classes.original} line-through`}>
                                        {currency}{product.originalPrice}/day
                                    </span>
                                )}
                                {showSubscriptionBadge && (
                                    <span className={`${classes.badge} bg-green-100 text-green-600 rounded`}>
                                        Plus Benefit
                                    </span>
                                )}
                            </div>
                        ) : product.tier === 'royal' ? (
                            // Royal items are 50% off for Plus users
                            <div className="flex items-center gap-2">
                                <span className={classes.price}>
                                    {currency}{product.rentalPricePerDay}
                                </span>
                                {showOriginalPrice && (
                                    <span className={`${classes.original} line-through`}>
                                        {currency}{product.originalPrice}/day
                                    </span>
                                )}
                                {showSubscriptionBadge && (
                                    <span className={`${classes.badge} bg-red-100 text-red-600 rounded`}>
                                        50% off
                                    </span>
                                )}
                            </div>
                        ) : (
                            // Luxury items are full price for Plus users
                            <div className="flex items-center gap-2">
                                <span className={classes.price}>
                                    {currency}{product.rentalPricePerDay}
                                </span>
                            </div>
                        )}
                        {product.usageLimitReached && (
                            <span className={`${classes.badge} bg-yellow-100 text-yellow-600 rounded`}>
                                Monthly Limit Reached
                            </span>
                        )}
                    </div>
                )}

                {/* Pro Users */}
                {userType === 'pro' && (
                    <div className="flex items-center gap-2">
                        {product.tier === 'premium' || product.tier === 'royal' ? (
                            // Premium and Royal items are free for Pro users
                            <div className="flex items-center gap-2">
                                <span className={`${classes.price} text-green-600`}>Free</span>
                                {showOriginalPrice && (
                                    <span className={`${classes.original} line-through`}>
                                        {currency}{product.originalPrice}/day
                                    </span>
                                )}
                                {showSubscriptionBadge && (
                                    <span className={`${classes.badge} bg-green-100 text-green-600 rounded`}>
                                        Pro Benefit
                                    </span>
                                )}
                            </div>
                        ) : (
                            // Luxury items are full price for Pro users
                            <div className="flex items-center gap-2">
                                <span className={classes.price}>
                                    {currency}{product.rentalPricePerDay}
                                </span>
                            </div>
                        )}
                        {product.usageLimitReached && (
                            <span className={`${classes.badge} bg-yellow-100 text-yellow-600 rounded`}>
                                Monthly Limit Reached
                            </span>
                        )}
                    </div>
                )}

                {/* Show upgrade prompt for free users */}
                {userType === 'free' && !isLoggedIn && (
                    <div className="text-xs text-blue-600">
                        Login to see your price
                    </div>
                )}
            </div>
        </div>
    );
};

export default PricingDisplay;
