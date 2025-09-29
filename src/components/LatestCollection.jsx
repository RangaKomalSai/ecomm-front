import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {

    const { products, userType } = useContext(ShopContext);
    const [latestProducts,setLatestProducts] = useState([]);

    useEffect(()=>{
        setLatestProducts(products.slice(0,10));
    },[products])

  return (
    <div className='py-16 px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl lg:text-4xl font-semibold mb-4 text-[#3d2b1f]'>
            Latest Collections
          </h2>
          <p className='text-lg text-[#3d2b1f] opacity-80 max-w-2xl mx-auto'>
            Fresh arrivals curated to keep your wardrobe always on trend
          </p>
        </div>

        {/* Rendering Products */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
          {
            latestProducts.map((item,index)=>(
              <ProductItem 
                key={index} 
                id={item._id} 
                image={item.image} 
                name={item.name} 
                rentalPricePerDay={item.rentalPricePerDay}
                originalPrice={item.originalPrice}
                discountType={item.discountType}
                isFree={item.isFree}
                userType={userType}
                tier={item.tier}
                mrp={item.mrp}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default LatestCollection
