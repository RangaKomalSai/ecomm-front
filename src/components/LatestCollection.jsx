import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products, loading } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    // Get the 10 most recently added products
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-semibold mb-4 text-[#3d2b1f]">
            Latest Collections
          </h2>
          <p className="text-lg text-[#3d2b1f] opacity-80 max-w-2xl mx-auto">
            Fresh arrivals curated to keep your wardrobe always on trend
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-lg text-[#3d2b1f]">Loading products...</p>
          </div>
        )}

        {/* No Products State */}
        {!loading && latestProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-[#3d2b1f] opacity-60">
              No products available
            </p>
          </div>
        )}

        {/* Rendering Products */}
        {!loading && latestProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
            {latestProducts.map((item) => (
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
        )}
      </div>
    </div>
  );
};

export default LatestCollection;
