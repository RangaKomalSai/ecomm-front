import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import PricingDisplay from "./PricingDisplay";
import WishlistButton from "./WishlistButton";

const ProductItem = ({
  id,
  productId,
  images,
  name,
  mrp,
  twoDayRentalPrice,
  fourDayRentalPrice,
  sevenDayRentalPrice,
  fourteenDayRentalPrice,
  category,
  condition,
  bestseller,
  isAvailable,
}) => {
  const { subscription, planLevel } = useContext(ShopContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [carouselInterval, setCarouselInterval] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-scroll carousel on hover
  useEffect(() => {
    if (isHovered && images && images.length > 1) {
      // Start carousel immediately with a short timeout for better responsiveness
      const startCarousel = () => {
        setIsTransitioning(true);
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
        // Reset transition state after animation completes
        setTimeout(() => setIsTransitioning(false), 500);
      };

      // Start first transition after 500ms for immediate feedback
      const initialTimeout = setTimeout(startCarousel, 500);

      // Then continue with regular interval
      const interval = setInterval(startCarousel, 2000); // 2 second intervals
      setCarouselInterval(interval);

      return () => {
        clearTimeout(initialTimeout);
        clearInterval(interval);
      };
    } else {
      if (carouselInterval) {
        clearInterval(carouselInterval);
        setCarouselInterval(null);
      }
    }
  }, [isHovered, images]);

  // Reset to first image when not hovered
  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0);
    }
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Check if images array exists and has content
  const displayImages =
    images && images.length > 0 ? images : ["/placeholder-image.jpg"];

  return (
    <div className="text-[#3d2b1f] cursor-pointer hover:text-[#5a3c2c] transition-colors">
      {/* Myntra-style larger card container */}
      <div
        className={`w-full h-[380px] bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group hover:scale-[1.01] ${
          !isAvailable ? "opacity-60" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Carousel image container with Myntra-style hover effects */}
        <Link
          onClick={() => scrollTo(0, 0)}
          to={`/product/${productId}`}
          className="w-full h-full block"
        >
          <div className="w-full h-[280px] overflow-hidden bg-gray-100 relative">
            {/* Wishlist button - positioned outside the link */}
            <div
              className="absolute top-2 right-2 z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <WishlistButton productId={id} size="sm" />
            </div>

            {/* Badges - Bestseller, Category, Condition */}
            {/* <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
              {bestseller && (
                <span className="bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded shadow-sm">
                  Bestseller
                </span>
              )}
              {category && (
                <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-sm capitalize">
                  {category}
                </span>
              )}
              {!isAvailable && (
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded shadow-sm">
                  Out of Stock
                </span>
              )}
            </div> */}

            {/* Main image with carousel functionality */}
            <div className="relative w-full h-full overflow-hidden">
              {/* Container for all images with sliding effect */}
              <div
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{
                  width: `${displayImages.length * 100}%`,
                  transform: `translateX(-${
                    (currentImageIndex * 100) / displayImages.length
                  }%)`,
                }}
              >
                {displayImages.map((img, index) => (
                  <div
                    key={index}
                    className="w-full h-full flex-shrink-0"
                    style={{ width: `${100 / displayImages.length}%` }}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={img}
                      alt={`${name} - Image ${index + 1}`}
                      draggable={false}
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzVMMTI1IDEwMEgxMDBWNzVaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMDAgMTI1TDEyNSAxMDBIMTAwVjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSI3NSIgeT0iNzUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDUwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMjUgMTJIMzVWMjJIMjVWMTJaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNSAyMkgzNVYzMkgxNVYyMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Myntra-style dots indicator - only show on hover and if multiple images */}
            {isHovered && displayImages && displayImages.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* White background container spanning full width */}
                <div className="bg-white bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <div className="flex space-x-1.5">
                    {displayImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                          index === currentImageIndex
                            ? "bg-gray-800 shadow-sm"
                            : "bg-gray-400 bg-opacity-60"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsTransitioning(true);
                          setCurrentImageIndex(index);
                          setTimeout(() => setIsTransitioning(false), 500);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Enhanced content area with better spacing */}
        <Link
          onClick={() => scrollTo(0, 0)}
          to={`/product/${productId}`}
          className="flex-1 p-4 flex flex-col justify-between min-h-[100px]"
        >
          {/* Product name and condition */}
          <div className="mb-2">
            <p
              className="text-sm text-[#3d2b1f] font-medium leading-tight truncate"
              title={name}
            >
              {name}
            </p>
          </div>

          {/* Enhanced pricing section */}
          <div className="min-h-[40px] flex items-start flex-col">
            <PricingDisplay
              product={{
                mrp,
                twoDayRentalPrice,
                fourDayRentalPrice,
                sevenDayRentalPrice,
                fourteenDayRentalPrice,
                category,
              }}
              subscription={subscription}
              planLevel={planLevel}
              rentalDays={2}
              showOriginalPrice={true}
              showSubscriptionBadge={true}
              showMRP={false}
              showRentalPrice={false}
              size="normal"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductItem;
