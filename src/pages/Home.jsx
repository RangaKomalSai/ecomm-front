import React, { useState, useContext, useEffect } from 'react'
import Hero from '../components/Hero'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'

const Home = () => {
  const { products, userType, getProductsData } = useContext(ShopContext)
  const [activeTab, setActiveTab] = useState('all')
  const [displayProducts, setDisplayProducts] = useState([])

  useEffect(() => {
    // Fetch all products on mount
    getProductsData()
  }, [])

  useEffect(() => {
    let filtered = products

    if (activeTab === 'men') {
      filtered = products.filter(item => {
        const gender = item.gender || item.filters?.find(f => f.type === 'gender')?.value
        return gender === 'men' || gender === 'Men' || gender === 'M'
      })
    } else if (activeTab === 'women') {
      filtered = products.filter(item => {
        const gender = item.gender || item.filters?.find(f => f.type === 'gender')?.value
        return gender === 'women' || gender === 'Women' || gender === 'W'
      })
    }

    setDisplayProducts(filtered.slice(0, 10))
  }, [activeTab, products])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'men') {
      getProductsData('men')
    } else if (tab === 'women') {
      getProductsData('women')
    } else {
      getProductsData()
    }
  }

  return (
    <div>
      {/* Tabs Section - Right below navbar, always visible */}
      <div className='w-screen -ml-[calc(50vw-50%)] bg-white border-b border-[#e8dccf] shadow-sm py-4 sticky top-[60px] z-40'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='flex justify-center'>
            <div className='inline-flex bg-white rounded-lg p-1 shadow-lg border-2 border-[#e8dccf]'>
              <button
                onClick={() => handleTabChange('all')}
                className={`px-6 py-3 rounded-md font-semibold text-sm md:text-base transition-all duration-200 ${
                  activeTab === 'all'
                    ? 'bg-[#3d2b1f] text-white shadow-md'
                    : 'text-[#3d2b1f] hover:bg-[#f5ece3]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleTabChange('men')}
                className={`px-6 py-3 rounded-md font-semibold text-sm md:text-base transition-all duration-200 ${
                  activeTab === 'men'
                    ? 'bg-[#3d2b1f] text-white shadow-md'
                    : 'text-[#3d2b1f] hover:bg-[#f5ece3]'
                }`}
              >
                Men
              </button>
              <button
                onClick={() => handleTabChange('women')}
                className={`px-6 py-3 rounded-md font-semibold text-sm md:text-base transition-all duration-200 ${
                  activeTab === 'women'
                    ? 'bg-[#3d2b1f] text-white shadow-md'
                    : 'text-[#3d2b1f] hover:bg-[#f5ece3]'
                }`}
              >
                Women
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Hero />

      {/* Products Section */}
      <div className='py-16 px-6 bg-[#fdf7f0]'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl lg:text-4xl font-semibold mb-4 text-[#3d2b1f]'>
              {activeTab === 'all' && 'Latest Collections'}
              {activeTab === 'men' && "Men's Collection"}
              {activeTab === 'women' && "Women's Collection"}
            </h2>
            <p className='text-lg text-[#3d2b1f] opacity-80 max-w-2xl mx-auto'>
              {activeTab === 'all' && 'Fresh arrivals curated to keep your wardrobe always on trend'}
              {activeTab === 'men' && 'Discover the latest in men\'s fashion and style'}
              {activeTab === 'women' && 'Explore the newest trends in women\'s fashion'}
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