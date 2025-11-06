import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import PricingDisplay from "../components/PricingDisplay";
import WishlistButton from "../components/WishlistButton";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const {
    products,
    token,
    addToCart,
    planLevel,
    subscription,
    fetchProductById,
    loading,
  } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [rentalDays, setRentalDays] = useState(2);
  const [selectedSize, setSelectedSize] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ===== DURATION OPTIONS BASED ON PLAN LEVEL =====
  const getAvailableDurations = () => {
    if (planLevel === "free") {
      // Free users: 2, 4, 7 days only (NO 14 days)
      return [
        { days: 2, label: "2 Days", price: productData?.twoDayRentalPrice },
        { days: 4, label: "4 Days", price: productData?.fourDayRentalPrice },
        { days: 7, label: "7 Days", price: productData?.sevenDayRentalPrice },
      ];
    } else if (planLevel === "plus" || planLevel === "pro") {
      // Plus/Pro users: ONLY 14 days (fixed)
      return [
        {
          days: 14,
          label: "14 Days",
          price: productData?.fourteenDayRentalPrice,
        },
      ];
    }
    // Fallback (should not happen)
    return [];
  };

  // Fetch product data
  const fetchProductData = async () => {
    // First try to find in local products array
    const localProduct = products.find((item) => item._id === productId);

    if (localProduct) {
      setProductData(localProduct);
      setImage(localProduct.images?.[0] || "");
    } else {
      // Fetch from backend if not in local array
      const result = await fetchProductById(productId);
      if (result.success && result.product) {
        setProductData(result.product);
        setImage(result.product.images?.[0] || "");
      } else {
        toast.error("Product not found");
        navigate("/collection");
      }
    }
  };

  // Set default rental duration based on plan
  useEffect(() => {
    if (productData && !rentalDays) {
      const durations = getAvailableDurations();
      if (durations.length > 0) {
        // Free users: default to 7 days
        // Plus/Pro users: automatically 14 days
        const defaultDuration = planLevel === "free" ? 7 : 14;
        setRentalDays(defaultDuration);
      }
    }
  }, [productData, planLevel]);

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  useEffect(() => {
    if (startDate && rentalDays) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + rentalDays);
      setEndDate(end.toISOString().split("T")[0]);
    }
  }, [startDate, rentalDays]);

  const getMinDate = () => {
    const today = new Date();
    const utcTime = today.getTime();
    const indiaTime = new Date(utcTime + 5.5 * 60 * 60 * 1000);
    return indiaTime.toISOString().split("T")[0];
  };

  // Get rental price based on duration and subscription
  const getRentalPrice = () => {
    if (!productData) return 0;

    // For Plus/Pro users with 14-day rentals
    if (["plus", "pro"].includes(planLevel)) {
      const category = productData.category;

      if (planLevel === "plus") {
        if (category === "premium") return 0; // Free
        if (category === "royal")
          return Math.round(productData.fourteenDayRentalPrice * 0.5); // 50% off
        return productData.fourteenDayRentalPrice; // Luxury - full price
      }

      if (planLevel === "pro") {
        if (category === "premium" || category === "royal") return 0; // Free
        return productData.fourteenDayRentalPrice; // Luxury - full price
      }
    }

    // For Free users - choose by rental days
    switch (rentalDays) {
      case 2:
        return productData.twoDayRentalPrice || 0;
      case 4:
        return productData.fourDayRentalPrice || 0;
      case 7:
        return productData.sevenDayRentalPrice || 0;
      case 14:
        return productData.fourteenDayRentalPrice || 0;
      default:
        return productData.twoDayRentalPrice || 0;
    }
  };

  const handleAddToCart = async () => {
    if (!productData.isAvailable) {
      toast.error("This product is currently out of stock");
      return;
    }

    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (!startDate) {
      toast.error("Please select a start date");
      return;
    }

    const minDate = getMinDate();
    if (startDate < minDate) {
      toast.error("Start date cannot be in the past");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    // Check if selected size is available
    const sizeOption = productData.sizes?.find((s) => s.size === selectedSize);
    if (!sizeOption || !sizeOption.available) {
      toast.error("Selected size is not available");
      return;
    }

    // Determine effective rental duration
    const effectiveDays = ["plus", "pro"].includes(planLevel) ? 14 : rentalDays;

    try {
      await addToCart(productData._id, selectedSize, effectiveDays, startDate);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  // Loading state
  if (loading || !productData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf7f0]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2b1f]"></div>
          <p className="text-[#3d2b1f]">Loading product...</p>
        </div>
      </div>
    );
  }

  const availableDurations = getAvailableDurations();

  return (
    <div className="border-t-2 border-[#e8dccf] pt-10 transition-opacity ease-in duration-500 opacity-100 bg-[#fdf7f0] text-[#3d2b1f] px-4 sm:px-[1vw] md:px-[3vw] lg:px-[3vw]">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col lg:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.images &&
              productData.images.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  key={index}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded-lg hover:opacity-75 transition-opacity"
                  alt={`${productData.name} view ${index + 1}`}
                  draggable={false}
                />
              ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img
              className="w-full h-auto rounded-xl shadow-lg"
              src={image}
              alt={productData.name}
              draggable={false}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="font-bold text-2xl lg:text-3xl text-[#3d2b1f]">
                  {productData.name}
                </h1>
                {token && (
                  <WishlistButton productId={productData._id} size="md" />
                )}
              </div>

              {/* Product ID and Category Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {/* <span className="bg-[#e8dccf] text-[#3d2b1f] text-xs px-2 py-1 rounded-full font-medium">
                  ID: {productData.productId}
                </span> */}
                {productData.category && (
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium capitalize">
                    {productData.category}
                  </span>
                )}
                {/* {productData.condition && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium capitalize">
                    {productData.condition}
                  </span>
                )} */}
                {productData.bestseller && (
                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                    Bestseller
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rating */}
          {/* <div className="flex items-center gap-1 mt-2">
            <FontAwesomeIcon
              icon={faStar}
              className="w-4 h-4 text-yellow-400"
            />
            <FontAwesomeIcon
              icon={faStar}
              className="w-4 h-4 text-yellow-400"
            />
            <FontAwesomeIcon
              icon={faStar}
              className="w-4 h-4 text-yellow-400"
            />
            <FontAwesomeIcon
              icon={faStar}
              className="w-4 h-4 text-yellow-400"
            />
            <FontAwesomeIcon
              icon={faStarRegular}
              className="w-4 h-4 text-gray-300"
            />
            <p className="pl-2 text-sm text-gray-600">(122 reviews)</p>
          </div> */}

          {/* Pricing Display */}
          <div className="mt-5">
            <PricingDisplay
              product={productData}
              subscription={subscription}
              planLevel={planLevel}
              rentalDays={rentalDays}
              size="large"
              showOriginalPrice={true}
              showSubscriptionBadge={true}
              showMRP={true}
            />
          </div>

          {/* Description - render Markdown (supports bold/italics/links) and preserve line breaks */}
          <div className="mt-5 text-[#3d2b1f] opacity-80 md:w-4/5 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              children={productData.description || ""}
            />
          </div>

          {/* Pristine Promise */}
          <div className="bg-gradient-to-r from-[#f5ece3] to-[#fdf7f0] p-4 rounded-lg mt-5 border border-[#e8dccf]">
            <h3 className="font-semibold text-sm mb-2 text-[#3d2b1f] flex items-center gap-2">
              <span className="text-green-600">✓</span> Pristine Promise
            </h3>
            <p className="text-xs text-[#3d2b1f] opacity-80">
              Professionally cleaned, sanitized, and quality-checked before
              delivery
            </p>
          </div>

          {/* Size Selection */}
          {productData.sizes && productData.sizes.length > 0 && (
            <div className="flex flex-col gap-2 my-6">
              <p className="font-semibold text-[#3d2b1f]">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {productData.sizes.map((sizeOption, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(sizeOption.size)}
                    disabled={!sizeOption.available}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${
                      selectedSize === sizeOption.size
                        ? "bg-[#3d2b1f] text-white border-[#3d2b1f] scale-105"
                        : sizeOption.available
                        ? "border-[#e8dccf] hover:border-[#3d2b1f] hover:bg-[#f5ece3]"
                        : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                    }`}
                  >
                    {sizeOption.size}
                    {!sizeOption.available && " (Out)"}
                  </button>
                ))}
              </div>
              {/* {selectedSize && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Size {selectedSize} selected
                </p>
              )} */}
            </div>
          )}

          {/* ===== RENTAL DURATION SELECTION ===== */}
          <div className="flex flex-col gap-4 my-6">
            <div className="flex items-center gap-2">
              <p className="font-semibold">Rental Duration</p>
            </div>

            {/* Show info message for Plus/Pro users */}
            {/* {(planLevel === "plus" || planLevel === "pro") && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <p className="text-blue-800">
                  <strong>Note:</strong> Your {planLevel} plan includes a fixed
                  14-day rental period with
                  {planLevel === "plus"
                    ? "special discounts"
                    : "maximum benefits"}
                  .
                </p>
              </div>
            )} */}

            {/* Duration options */}
            <div className="flex gap-2 flex-wrap">
              {availableDurations.map((duration) => (
                <button
                  key={duration.days}
                  onClick={() => setRentalDays(duration.days)}
                  disabled={planLevel !== "free" && duration.days !== 14}
                  className={`px-4 py-2 border rounded-md text-sm font-mediumg transition-all ${
                    rentalDays === duration.days
                      ? "border-[#3d2b1f] bg-[#3d2b1f] text-white"
                      : "border-gray-300 hover:border-[#3d2b1f]"
                  } ${planLevel !== "free" ? "cursor-default" : ""}`}
                >
                  <div className="text-center">
                    <div className="font-semibold">{duration.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Start Date Selection */}
          <div className="flex flex-col gap-2 w-1/2 pb-4">
            <label className="font-semibold text-[#3d2b1f]">Start Date</label>
            <input
              type="date"
              value={startDate}
              min={getMinDate()}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-2 border-[#e8dccf] py-2 px-3 rounded-lg focus:border-[#3d2b1f] focus:outline-none"
              required
            />
            {startDate && endDate && (
              <p className="text-xs text-gray-600 mt-1">
                Return by:{" "}
                <span className="font-semibold">
                  {new Date(endDate).toLocaleDateString("en-IN")}
                </span>
              </p>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!productData.isAvailable}
            className={`w-full py-3 text-sm font-semibold rounded-lg transition-all ${
              productData.isAvailable
                ? "bg-[#3d2b1f] text-white hover:bg-[#5a3c2c] active:scale-95"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            aria-label={
              productData.isAvailable
                ? `Add ${productData.name} to cart for ₹${getRentalPrice()}`
                : "Out of stock - cannot add to cart"
            }
          >
            {productData.isAvailable ? "ADD TO CART" : "OUT OF STOCK"}
          </button>

          {/* Upgrade Banner for Free Users */}
          {planLevel === "free" && productData.category !== "luxury" && (
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-amber-50 border-2 border-purple-200 rounded-xl p-4">
              <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faStar}
                  className="w-4 h-4 text-amber-500"
                />
                Upgrade to Save More!
              </h3>
              <p className="text-sm text-purple-700 mb-3">
                {productData.category === "premium"
                  ? "Rent this item FREE with Plus or Pro plan!"
                  : "Get 50% off with Plus plan or FREE with Pro plan!"}
              </p>
              <button
                onClick={() => navigate("/subscription-plans")}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                View Plans
              </button>
            </div>
          )}

          <hr className="mt-8 sm:w-4/5 border-[#e8dccf]" />

          {/* Benefits */}
          <div className="text-sm text-gray-600 mt-5 flex flex-col gap-2">
            <p className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span> Professionally
              cleaned and sanitized
            </p>
            <p className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span> Quality
              checked before each rental
            </p>
            <p className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span> Damage
              protection included
            </p>
          </div>
        </div>
      </div>

      {/* Description & Review Section */}
      {/* <div className="mt-20">
        <div className="flex border-b border-[#e8dccf]">
          <button className="px-6 py-3 text-sm font-semibold border-b-2 border-[#3d2b1f] text-[#3d2b1f]">
            Description
          </button>
          <button className="px-6 py-3 text-sm text-gray-600 hover:text-[#3d2b1f] transition-colors">
            Reviews (122)
          </button>
        </div>
        <div className="flex flex-col gap-4 bg-white border border-[#e8dccf] rounded-b-xl px-6 py-6 text-sm text-gray-700 leading-relaxed">
          <p>
            Experience premium fashion rental with our carefully curated
            collection. Each item undergoes rigorous quality checks and
            professional cleaning with our Pristine Promise guarantee.
          </p>
          <p>
            Our rental model promotes sustainable fashion while providing
            affordable access to high-quality pieces. Enjoy variety in your
            wardrobe at a fraction of retail cost, with flexible rental periods
            and subscription benefits.
          </p>
        </div>
      </div> */}

      {/* Related Products */}
      <RelatedProducts
        category={
          productData.filters?.find((f) => f.type === "category")?.value
        }
        subCategory={
          productData.filters?.find((f) => f.type === "subCategory")?.value
        }
      />
    </div>
  );
};

export default Product;
