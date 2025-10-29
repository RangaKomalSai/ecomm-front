import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const PricingDisplay = ({
  product,
  subscription,
  planLevel,
  rentalDays = 2,
  showOriginalPrice = true,
  showSubscriptionBadge = true,
  showMRP = false, // Only show MRP on product detail page
  showRentalPrice = true, // Show rental price (false for collection/home pages)
  size = "normal", // 'small', 'normal', 'large'
}) => {
  const { isPremiumUser } = useContext(ShopContext);

  if (!product) return null;

  // Currency symbol - INR
  const currency = "Rs.";

  // Size classes
  const sizeClasses = {
    small: {
      price: "text-sm font-medium",
      original: "text-xs text-gray-400",
      badge: "text-xs px-1 py-0.5",
      container: "flex items-center gap-1",
    },
    normal: {
      price: "text-base font-medium",
      original: "text-sm text-gray-400",
      badge: "text-xs px-2 py-1",
      container: "flex items-center gap-2",
    },
    large: {
      price: "text-lg font-medium",
      original: "text-base text-gray-400",
      badge: "text-sm px-3 py-1",
      container: "flex items-center gap-3",
    },
  };

  const classes = sizeClasses[size];

  // Use planLevel from props if provided, otherwise from context
  const effectivePlanLevel = planLevel || "free";

  // Calculate pricing based on backend logic
  const pricingResult = calculateRentalPrice(
    product,
    effectivePlanLevel,
    rentalDays
  );

  const { displayPrice, originalPrice, durationText, badge, discount } =
    pricingResult;

  // If showRentalPrice is false, show MRP instead (for collection pages)
  if (!showRentalPrice) {
    return (
      <div className="flex flex-col gap-1">
        <div className={classes.container}>
          <span className={classes.price}>
            Retail: {currency}
            {product.mrp}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {/* MRP Display - Only on product detail page */}
      {showMRP && product.mrp && (
        <div className={`flex items-center gap-2 mb-1 ${classes.price}`}>
          <span className="text-gray-500">MRP:</span>
          <span className="font-medium text-gray-500 line-through">
            {currency}
            {product.mrp}
          </span>
        </div>
      )}

      {/* Rental Price Display */}
      <div className={classes.container}>
        <span className={classes.price}>
          {displayPrice === 0 ? (
            <span className="text-green-600">Free Rental</span>
          ) : (
            <>
              {currency}
              {displayPrice}
            </>
          )}
          {durationText && (
            <span className="text-xs text-gray-500 ml-1">{durationText}</span>
          )}
        </span>

        {showOriginalPrice &&
          originalPrice > displayPrice &&
          originalPrice > 0 && (
            <span className={`${classes.original} line-through`}>
              {currency}
              {originalPrice}
            </span>
          )}

        {discount > 0 && showSubscriptionBadge && (
          <span
            className={`${classes.badge} bg-green-100 text-green-600 rounded font-semibold`}
          >
            {discount}% OFF
          </span>
        )}

        {showSubscriptionBadge && badge && (
          <span
            className={`${classes.badge} bg-purple-100 text-purple-600 rounded font-semibold`}
          >
            {badge}
          </span>
        )}

        {/* Check if user has reached rental limit */}
        {subscription?.itemsRentedInPeriod >= subscription?.rentalLimit &&
          subscription?.rentalLimit !== null && (
            <span
              className={`${classes.badge} bg-yellow-100 text-yellow-700 rounded font-medium`}
            >
              Limit Reached
            </span>
          )}
      </div>
    </div>
  );
};

export default PricingDisplay;

/**
 * Calculate rental price based on subscription plan and product category
 * Mirrors backend pricingUtils logic
 */
function calculateRentalPrice(product, planLevel, rentalDays) {
  if (!product) {
    return {
      displayPrice: 0,
      originalPrice: 0,
      durationText: "",
      badge: "",
      discount: 0,
    };
  }

  const {
    twoDayRentalPrice,
    fourDayRentalPrice,
    sevenDayRentalPrice,
    fourteenDayRentalPrice,
    category, // "premium" | "royal" | "luxury"
  } = product;

  // Get base rental price for the duration (free users)
  let basePrice = 0;
  let durationText = "";

  switch (rentalDays) {
    case 2:
      basePrice = twoDayRentalPrice || 0;
      durationText = "/2 days";
      break;
    case 4:
      basePrice = fourDayRentalPrice || 0;
      durationText = "/4 days";
      break;
    case 7:
      basePrice = sevenDayRentalPrice || 0;
      durationText = "/7 days";
      break;
    case 14:
      basePrice = fourteenDayRentalPrice || 0;
      durationText = "/14 days";
      break;
    default:
      // Default to 2-day pricing
      basePrice = twoDayRentalPrice || 0;
      durationText = `/${rentalDays} days`;
  }

  // Free users - no discounts
  if (planLevel === "free") {
    return {
      displayPrice: basePrice,
      originalPrice: basePrice,
      durationText,
      badge: "",
      discount: 0,
    };
  }

  // Plus plan logic
  if (planLevel === "plus") {
    if (category === "premium") {
      // Premium items free for Plus users
      return {
        displayPrice: 0,
        originalPrice: basePrice,
        durationText: "/14 days",
        badge: "Plus Benefit",
        discount: 100,
      };
    } else if (category === "royal") {
      // Royal items 50% off for Plus users
      const discountedPrice = Math.round(
        (fourteenDayRentalPrice || basePrice) * 0.5
      );
      return {
        displayPrice: discountedPrice,
        originalPrice: fourteenDayRentalPrice || basePrice,
        durationText: "/14 days",
        badge: "Plus 50% OFF",
        discount: 50,
      };
    } else {
      // Luxury items - no discount for Plus
      return {
        displayPrice: fourteenDayRentalPrice || basePrice,
        originalPrice: fourteenDayRentalPrice || basePrice,
        durationText: "/14 days",
        badge: "",
        discount: 0,
      };
    }
  }

  // Pro plan logic
  if (planLevel === "pro") {
    if (category === "premium" || category === "royal") {
      // Premium and Royal items free for Pro users
      return {
        displayPrice: 0,
        originalPrice: fourteenDayRentalPrice || basePrice,
        durationText: "/14 days",
        badge: "Pro Benefit",
        discount: 100,
      };
    } else {
      // Luxury items - no discount for Pro (or minimal discount if you want)
      return {
        displayPrice: fourteenDayRentalPrice || basePrice,
        originalPrice: fourteenDayRentalPrice || basePrice,
        durationText: "/14 days",
        badge: "",
        discount: 0,
      };
    }
  }

  // Fallback
  return {
    displayPrice: basePrice,
    originalPrice: basePrice,
    durationText,
    badge: "",
    discount: 0,
  };
}
