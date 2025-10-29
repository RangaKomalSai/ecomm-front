import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";

const WishlistButton = ({ productId, className = "", size = "md" }) => {
  const { token, wishlist, addToWishlist, removeFromWishlist, loading } =
    useContext(ShopContext);

  const navigate = useNavigate();

  // Check if product is in wishlist - using useMemo for performance
  const isInWishlist = useMemo(() => {
    if (!wishlist || !productId) return false;

    // Backend returns array of populated product objects with _id
    return wishlist.some((item) => {
      // Handle both populated objects and plain IDs
      const itemId = typeof item === "object" ? item._id : item;
      return itemId === productId;
    });
  }, [wishlist, productId]);

  const handleToggleWishlist = async (e) => {
    // Stop event propagation to prevent parent click handlers
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.info("Please login to add items to wishlist");
      navigate("/login");
      return;
    }

    if (!productId) {
      return;
    }

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await removeFromWishlist(productId);
      } else {
        // Add to wishlist
        await addToWishlist(productId);
      }
    } catch (error) {
      // Error handling is done in context
      console.error("Wishlist toggle error:", error);
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      button: "w-8 h-8",
      icon: "text-sm",
    },
    md: {
      button: "w-10 h-10",
      icon: "text-base",
    },
    lg: {
      button: "w-12 h-12",
      icon: "text-lg",
    },
  };

  const config = sizeConfig[size] || sizeConfig.md;

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`
        ${config.button}
        ${config.icon}
        flex items-center justify-center
        rounded-full border-2 transition-all duration-200
        hover:scale-110 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-md hover:shadow-lg
        ${
          isInWishlist
            ? "bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600"
            : "bg-white border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-500"
        }
        ${className}
      `}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <FontAwesomeIcon
        icon={isInWishlist ? faHeart : faHeartRegular}
        className={`${loading ? "animate-pulse" : ""} transition-transform`}
      />
    </button>
  );
};

export default WishlistButton;
