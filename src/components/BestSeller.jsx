import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {

    const {products, userType} = useContext(ShopContext);
    const [bestSeller,setBestSeller] = useState([]);

    useEffect(()=>{
        const bestProduct = products.filter((item)=>(item.bestseller));
        setBestSeller(bestProduct.slice(0,5))
    },[products])

  return (
    <div className='py-16 px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl lg:text-4xl font-semibold mb-4 text-[#3d2b1f]'>
            Best Sellers
          </h2>
          <p className='text-lg text-[#3d2b1f] opacity-80 max-w-2xl mx-auto'>
            Discover the most rented and loved styles of the season
          </p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
          {
              bestSeller.map((item,index)=>(
                  <ProductItem 
                      key={index} 
                      id={item._id} 
                      name={item.name} 
                      image={item.image} 
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

export default BestSeller
