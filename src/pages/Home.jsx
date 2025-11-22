import React, { useContext, useEffect, useState } from 'react'
import Hero from '../components/Hero'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'

const Home = () => {
  const { products, userType, getProductsData } = useContext(ShopContext)
  const [displayProducts, setDisplayProducts] = useState([])

  useEffect(() => {
    // Fetch all products on mount
    getProductsData()
  }, [])

  useEffect(() => {
    setDisplayProducts(products.slice(0, 10))
  }, [products])

  return (
    <div>
      <Hero />

      {/* Products Section */}
      <div className='py-16 px-6 bg-[#fdf7f0]'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl lg:text-4xl font-semibold mb-4 text-[#3d2b1f]'>
              Latest Collections
            </h2>
            <p className='text-lg text-[#3d2b1f] opacity-80 max-w-2xl mx-auto'>
              Fresh arrivals curated to keep your wardrobe always on trend
            </p>
          </div>

          {/* Products Grid */}
          {displayProducts.length > 0 ? (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6'>
              {displayProducts.map((item, index) => (
                <ProductItem 
                  key={item._id || index} 
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
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <p className='text-[#3d2b1f] opacity-60 text-lg'>
                No products found in this category
              </p>
            </div>
          )}
        </div>
      </div>

      <BestSeller/>
      <OurPolicy/>
      <NewsletterBox/>
    </div>
  )
}

export default Home