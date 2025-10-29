import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ category, subCategory }) => {
  const { products, subscription, planLevel } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();

      // Filter by category if provided
      if (category) {
        productsCopy = productsCopy.filter((item) => {
          const itemCategory = item.filters?.find(
            (f) => f.type === "category"
          )?.value;
          return itemCategory === category;
        });
      }

      // Filter by subCategory if provided
      if (subCategory) {
        productsCopy = productsCopy.filter((item) => {
          const itemSubCategory = item.filters?.find(
            (f) => f.type === "subCategory"
          )?.value;
          return itemSubCategory === subCategory;
        });
      }

      // Get random 5 products from filtered list
      const shuffled = productsCopy.sort(() => 0.5 - Math.random());
      setRelated(shuffled.slice(0, 5));
    }
  }, [products, category, subCategory]);

  // Don't render if no related products
  if (related.length === 0) {
    return null;
  }

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2 mb-8">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6">
        {related.map((item) => (
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
    </div>
  );
};

export default RelatedProducts;
