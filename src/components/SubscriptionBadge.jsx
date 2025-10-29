import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

const SubscriptionBadge = ({ 
    userType, 
    size = 'normal',
    showUpgrade = false 
}) => {
    const { upgradeSubscription } = useContext(ShopContext);

    if (!userType || userType === 'free') {
        if (!showUpgrade) return null;
        
        return (
            <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                Free Plan
            </div>
        );
    }

    const badgeConfig = {
        plus: {
            text: 'Rotator Plus',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600',
            icon: faStar
        },
        pro: {
            text: 'Rotator Pro',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-600',
            icon: faCrown
        }
    };

    const config = badgeConfig[userType];
    const sizeClass = size === 'small' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1';

    return (
        <div className={`${config.bgColor} ${config.textColor} ${sizeClass} rounded font-medium flex items-center gap-1`}>
            <FontAwesomeIcon icon={config.icon} className="w-3 h-3" />
            <span>{config.text}</span>
        </div>
    );
};

export default SubscriptionBadge;
