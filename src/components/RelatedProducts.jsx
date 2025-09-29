import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({category,subCategory}) => {

    const { products, userType } = useContext(ShopContext);
    const [related,setRelated] = useState([]);

    useEffect(()=>{

        if (products.length > 0) {
            
            let productsCopy = products.slice();
            
            if (category) {
                productsCopy = productsCopy.filter((item) => {
                    const itemCategory = item.filters?.find(f => f.type === 'category')?.value;
                    return itemCategory === category;
                });
            }
            
            if (subCategory) {
                productsCopy = productsCopy.filter((item) => {
                    const itemSubCategory = item.filters?.find(f => f.type === 'subCategory')?.value;
                    return itemSubCategory === subCategory;
                });
            }

            setRelated(productsCopy.slice(0,5));
        }
        
    },[products, category, subCategory])

  return (
    <div className='my-24'>
      <div className=' text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={"PRODUCTS"} />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6'>
        {related.map((item,index)=>(
            <ProductItem 
                key={index} 
                id={item._id} 
                name={item.name} 
                rentalPricePerDay={item.rentalPricePerDay} 
                image={item.image}
                originalPrice={item.originalPrice}
                discountType={item.discountType}
                isFree={item.isFree}
                userType={userType}
                tier={item.tier}
                mrp={item.mrp}
            />
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
