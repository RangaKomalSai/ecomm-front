import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, filterOptions, loading, subscription, planLevel } =
    useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortType, setSortType] = useState("relevant");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFilter = (filterType, value) => {
    setActiveFilters((prev) => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [filterType]: newValues,
      };
    });
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    // Apply search filter
    if (searchQuery.trim()) {
      productsCopy = productsCopy.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply dynamic filters based on product.filters array
    Object.keys(activeFilters).forEach((filterType) => {
      const selectedValues = activeFilters[filterType];
      if (selectedValues.length > 0) {
        productsCopy = productsCopy.filter((item) => {
          // Check if product has matching filter
          const itemFilterValue = item.filters?.find(
            (f) => f.type === filterType
          )?.value;
          return itemFilterValue && selectedValues.includes(itemFilterValue);
        });
      }
    });

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        // Sort by MRP (lowest to highest)
        fpCopy.sort((a, b) => (a.mrp || 0) - (b.mrp || 0));
        break;

      case "high-low":
        // Sort by MRP (highest to lowest)
        fpCopy.sort((a, b) => (b.mrp || 0) - (a.mrp || 0));
        break;

      case "price-low-high":
        // Sort by rental price (2-day rate)
        fpCopy.sort(
          (a, b) => (a.twoDayRentalPrice || 0) - (b.twoDayRentalPrice || 0)
        );
        break;

      case "price-high-low":
        // Sort by rental price (2-day rate)
        fpCopy.sort(
          (a, b) => (b.twoDayRentalPrice || 0) - (a.twoDayRentalPrice || 0)
        );
        break;

      case "newest":
        // Sort by creation date (most recent first)
        fpCopy.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        break;

      default:
        // Relevant - no sorting, apply filters only
        applyFilter();
        return;
    }

    setFilterProducts(fpCopy);
  };

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilter();
  }, [activeFilters, searchQuery, products]);

  // Apply sorting when sort type changes
  useEffect(() => {
    if (sortType !== "relevant") {
      sortProduct();
    }
  }, [sortType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf7f0] to-[#f8f4f0] py-8 px-4">
      <div className="max-w-8xl mx-auto">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 bg-white border-2 border-[#e8dccf] rounded-xl focus:ring-2 focus:ring-[#3d2b1f] focus:border-transparent transition-all text-[#3d2b1f] placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Enhanced Filter Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-[#e8dccf] hover:shadow-md transition-all duration-200"
              >
                <span className="text-lg font-semibold text-[#3d2b1f]">
                  Filters
                </span>
                <img
                  className={`h-4 transition-transform duration-200 ${
                    showFilter ? "rotate-90" : ""
                  }`}
                  src={assets.dropdown_icon}
                  alt=""
                  draggable={false}
                />
              </button>
            </div>

            {/* Desktop Filter Header */}
            <div className="hidden lg:block mb-6">
              <h2 className="text-2xl font-bold text-[#3d2b1f]">Filters</h2>
              <div className="w-12 h-1 bg-[#3d2b1f] mt-2 rounded-full"></div>
            </div>

            {/* Dynamic Filter Sections */}
            <div
              className={`space-y-4 ${
                showFilter ? "block" : "hidden"
              } lg:block`}
            >
              {filterOptions && Object.keys(filterOptions).length > 0 ? (
                Object.keys(filterOptions).map((filterType) => (
                  <div
                    key={filterType}
                    className="bg-white rounded-xl shadow-sm border border-[#e8dccf] overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-[#3d2b1f] to-[#5a3c2c] px-6 py-4">
                      <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
                        {filterType === "category"
                          ? "Categories"
                          : filterType === "subCategory"
                          ? "Type"
                          : filterType.charAt(0).toUpperCase() +
                            filterType.slice(1)}
                      </h3>
                    </div>
                    <div className="p-6 space-y-3 max-h-64 overflow-y-auto">
                      {filterOptions[filterType].map((value) => (
                        <label
                          key={value}
                          className="flex items-center space-x-3 cursor-pointer group"
                        >
                          <input
                            className="w-4 h-4 text-[#3d2b1f] border-2 border-[#e8dccf] rounded focus:ring-2 focus:ring-[#3d2b1f] focus:ring-offset-0 cursor-pointer"
                            type="checkbox"
                            checked={
                              activeFilters[filterType]?.includes(value) ||
                              false
                            }
                            onChange={() => toggleFilter(filterType, value)}
                          />
                          <span className="text-sm font-medium text-[#3d2b1f] group-hover:text-[#5a3c2c] transition-colors">
                            {value}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-[#e8dccf] p-6 text-center">
                  <p className="text-gray-500 text-sm">No filters available</p>
                </div>
              )}

              {/* Clear Filters Button */}
              {Object.values(activeFilters).some(
                (values) => values.length > 0
              ) && (
                <button
                  onClick={() => setActiveFilters({})}
                  className="w-full py-3 px-4 bg-[#3d2b1f] text-white rounded-lg hover:bg-[#5a3c2c] transition-colors font-medium text-sm"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Enhanced Header Section */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e8dccf] p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#3d2b1f] mb-2">
                    All Collections
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {filterProducts.length}{" "}
                    {filterProducts.length === 1 ? "item" : "items"} found
                    {Object.values(activeFilters).some(
                      (values) => values.length > 0
                    ) && (
                      <span className="ml-2 text-[#3d2b1f] font-medium">
                        •{" "}
                        {Object.values(activeFilters).reduce(
                          (total, values) => total + values.length,
                          0
                        )}{" "}
                        filter
                        {Object.values(activeFilters).reduce(
                          (total, values) => total + values.length,
                          0
                        ) > 1
                          ? "s"
                          : ""}{" "}
                        applied
                      </span>
                    )}
                  </p>
                </div>

                {/* Enhanced Sort Dropdown */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-[#3d2b1f] whitespace-nowrap">
                    Sort by:
                  </label>
                  <select
                    onChange={(e) => setSortType(e.target.value)}
                    value={sortType}
                    className="bg-white border-2 border-[#e8dccf] text-[#3d2b1f] text-sm px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#3d2b1f] focus:border-transparent transition-all duration-200 hover:border-[#3d2b1f] min-w-[180px]"
                  >
                    <option value="relevant">Relevance</option>
                    <option value="newest">Newest First</option>
                    <option value="price-low-high">Rental: Low to High</option>
                    <option value="price-high-low">Rental: High to Low</option>
                    <option value="low-high">MRP: Low to High</option>
                    <option value="high-low">MRP: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-xl shadow-sm border border-[#e8dccf] p-12 text-center">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2b1f]"></div>
                </div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            )}

            {/* Enhanced Product Grid */}
            {!loading && filterProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filterProducts.map((item) => (
                  <ProductItem
                    key={item._id}
                    id={item._id}
                    productId={item.productId}
                    images={item.images}
                    name={item.name}
                    mrp={item.mrp}
                    twoDayRentalPrice={item.twoDayRentalPrice}
                    fourDayRentalPrice={item.fourDayRentalPrice}
                    sevenDayRentalPrice={item.sevenDayRentalPrice}
                    fourteenDayRentalPrice={item.fourteenDayRentalPrice}
                    category={item.category}
                    condition={item.condition}
                    bestseller={item.bestseller}
                    isAvailable={item.isAvailable}
                  />
                ))}
              </div>
            ) : (
              !loading && (
                /* Enhanced Empty State */
                <div className="bg-white rounded-xl shadow-sm border border-[#e8dccf] p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-[#3d2b1f] mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery
                        ? `No products match your search for "${searchQuery}"`
                        : "No products match your current filters"}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="px-6 py-2 bg-[#3d2b1f] text-white rounded-lg hover:bg-[#5a3c2c] transition-colors font-medium"
                        >
                          Clear Search
                        </button>
                      )}
                      {Object.values(activeFilters).some(
                        (values) => values.length > 0
                      ) && (
                        <button
                          onClick={() => setActiveFilters({})}
                          className="px-6 py-2 border-2 border-[#3d2b1f] text-[#3d2b1f] rounded-lg hover:bg-[#3d2b1f] hover:text-white transition-colors font-medium"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
