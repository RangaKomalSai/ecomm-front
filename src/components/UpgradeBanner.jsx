import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const UpgradeBanner = ({ 
    product, 
    showSavings = true,
    compact = false 
}) => {
    const { userType, upgradeSubscription, currency } = useContext(ShopContext);
    const navigate = useNavigate();

    if (userType === 'pro') return null; // Pro users don't need upgrade

    const handleUpgrade = async () => {
        if (userType === 'free') {
            // Redirect to subscription plans
            navigate('/subscription-plans');
        } else {
            // Upgrade to next tier
            const nextTier = userType === 'plus' ? 'pro' : 'plus';
            await upgradeSubscription(nextTier);
        }
    };

    const calculateSavings = () => {
        if (!product || !product.originalPrice) return 0;
        return product.originalPrice - product.rentalPricePerDay;
    };

    const savings = calculateSavings();

    if (compact) {
        return (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-medium text-sm">
                            {userType === 'free' ? 'Upgrade to save' : 'Upgrade for more savings'}
                        </span>
                        {showSavings && savings > 0 && (
                            <span className="text-green-600 text-sm font-medium">
                                Save {currency}{savings}/day
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleUpgrade}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                        {userType === 'free' ? 'View Plans' : 'Upgrade'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                        {userType === 'free' 
                            ? 'Unlock Subscription Benefits' 
                            : 'Upgrade for Maximum Savings'
                        }
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                        {userType === 'free' 
                            ? 'Get access to free and discounted items with our subscription plans'
                            : 'Get ALL items free with Rotator Pro'
                        }
                    </p>
                    {showSavings && savings > 0 && (
                        <p className="text-sm text-green-600 font-medium">
                            You could save {currency}{savings} per day on this item
                        </p>
                    )}
                </div>
                <button
                    onClick={handleUpgrade}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
                >
                    {userType === 'free' ? 'View Plans' : 'Upgrade Now'}
                </button>
            </div>
        </div>
    );
};

export default UpgradeBanner;
