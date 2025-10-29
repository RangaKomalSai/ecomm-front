import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import WishlistButton from "../components/WishlistButton";
import PricingDisplay from "../components/PricingDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const Wishlist = () => {
  const {
    wishlist,
    fetchWishlist,
    removeFromWishlist,
    token,
    planLevel,
    subscription,
    loading,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      if (token) {
        await fetchWishlist();
      }
      setIsLoading(false);
    };

    loadWishlist();
  }, [token]);

  const handleRemoveFromWishlist = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleAddToCart = (product) => {
    // Navigate to product page to add to cart with rental details
    navigate(`/product/${product._id}`);
  };

  // Not logged in
  if (!token) {
    return (
      <div className="min-h-screen bg-[#fdf7f0] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-[#e8dccf]">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-full flex items-center justify-center border-2 border-red-200">
              <FontAwesomeIcon
                icon={faHeart}
                className="text-4xl text-red-500"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#3d2b1f] mb-4">
              Save Your Favorites
            </h2>
            <p className="text-[#3d2b1f] opacity-80 mb-8 max-w-md mx-auto">
              Please login to save items to your wishlist and access them from
              any device
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#3d2b1f] text-[#fdf7f0] px-8 py-3 rounded-lg hover:bg-[#5a3c2c] transition-colors font-medium"
            >
              Login to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-[#fdf7f0] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[#e8dccf] rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-4 border border-[#e8dccf]"
                >
                  <div className="h-64 bg-[#e8dccf] rounded mb-4"></div>
                  <div className="h-4 bg-[#e8dccf] rounded mb-2"></div>
                  <div className="h-4 bg-[#e8dccf] rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-[#e8dccf] rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen border-t border-[#e8dccf] pt-16 pb-20 bg-[#fdf7f0] text-[#3d2b1f] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#3d2b1f] mb-2">
            My Wishlist
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-[#3d2b1f] opacity-80">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            </p>
            {planLevel !== "free" && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-amber-50 border border-purple-200 px-4 py-2 rounded-lg">
                <span className="text-sm font-semibold text-purple-700 capitalize">
                  {planLevel} Plan
                </span>
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Empty Wishlist */}
        {wishlist.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-[#e8dccf]">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-full flex items-center justify-center border-2 border-red-200">
              <FontAwesomeIcon
                icon={faHeart}
                className="text-4xl text-red-500"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#3d2b1f] mb-4">
              Your Wishlist is Empty
            </h2>
            <p className="text-[#3d2b1f] opacity-80 mb-8 max-w-md mx-auto">
              Start adding items you love to easily find them later
            </p>
            <button
              onClick={() => navigate("/collection")}
              className="bg-[#3d2b1f] text-[#fdf7f0] px-8 py-3 rounded-lg hover:bg-[#5a3c2c] transition-colors font-medium"
            >
              Browse Collection
            </button>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => {
              // Handle populated products from backend
              if (!product || !product._id) return null;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden border border-[#e8dccf]"
                >
                  {/* Product Image */}
                  <div
                    className="relative w-full h-[280px] overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <img
                      src={product.images?.[0] || assets.placeholder}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      draggable={false}
                    />

                    {/* Wishlist Button - Top Right */}
                    <div
                      className="absolute top-2 right-2 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <WishlistButton productId={product._id} size="md" />
                    </div>

                    {/* Availability Badge */}
                    {!product.isAvailable && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div className="mb-4">
                      <h3
                        className="text-base text-[#3d2b1f] font-semibold leading-tight mb-2 hover:text-[#5a3c2c] cursor-pointer line-clamp-2"
                        onClick={() => navigate(`/product/${product._id}`)}
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      {/* Pricing */}
                      <div className="mb-3">
                        <PricingDisplay
                          product={product}
                          subscription={subscription}
                          planLevel={planLevel}
                          showOriginalPrice={true}
                          size="normal"
                          showSubscriptionBadge={true}
                          showRentalPrice={false}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.isAvailable}
                        className={`w-full py-2.5 px-4 rounded-lg transition-all font-medium text-sm flex items-center justify-center gap-2 ${
                          product.isAvailable
                            ? "bg-[#3d2b1f] text-[#fdf7f0] hover:bg-[#5a3c2c] active:scale-95"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={faShoppingCart}
                          className="w-4 h-4"
                        />
                        {product.isAvailable ? "Add to Cart" : "Out of Stock"}
                      </button>

                      <button
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="w-full border-2 border-[#3d2b1f] text-[#3d2b1f] py-2.5 px-4 rounded-lg hover:bg-[#e8dccf] transition-all font-medium text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
