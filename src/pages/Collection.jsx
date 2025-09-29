import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {

  const { products , search , showSearch, userType, filterOptions } = useContext(ShopContext);
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortType,setSortType] = useState('relevant')

  const toggleFilter = (filterType, value) => {
    setActiveFilters(prev => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value) 
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [filterType]: newValues
      };
    });
  }

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    // Apply all active filters dynamically
    Object.keys(activeFilters).forEach(filterType => {
      const selectedValues = activeFilters[filterType];
      if (selectedValues.length > 0) {
        productsCopy = productsCopy.filter(item => {
          const itemFilterValue = item.filters?.find(f => f.type === filterType)?.value;
          return itemFilterValue && selectedValues.includes(itemFilterValue);
        });
      }
    });

    setFilterProducts(productsCopy)
  }

  const sortProduct = () => {

    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        fpCopy.sort((a,b) => (a.mrp - b.mrp));
        setFilterProducts([...fpCopy]);
        break;

      case 'high-low':
        fpCopy.sort((a,b) => (b.mrp - a.mrp));
        setFilterProducts([...fpCopy]);
        break;

      default:
        applyFilter();
        break;
    }

  }

  useEffect(()=>{
      applyFilter();
  },[activeFilters,search,showSearch,products])

  useEffect(()=>{
    if (sortType !== 'relevant') {
      sortProduct();
    }
  },[sortType])

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#fdf7f0] to-[#f8f4f0]'>
      <div className='max-w-8xl mx-auto'>
        <div className='flex flex-col lg:flex-row gap-6 lg:gap-8 pt-8'>
          
          {/* Enhanced Filter Sidebar */}
          <div className='lg:w-64'>
            {/* Mobile Filter Toggle */}
            <div className='lg:hidden mb-4'>
              <button 
                onClick={()=>setShowFilter(!showFilter)} 
                className='w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-[#e8dccf] hover:shadow-md transition-all duration-200'
              >
                <span className='text-lg font-semibold text-[#3d2b1f]'>Filters</span>
                <img 
                  className={`h-4 transition-transform duration-200 ${showFilter ? 'rotate-90' : ''}`} 
                  src={assets.dropdown_icon} 
                  alt="" 
                  draggable={false} 
                />
              </button>
            </div>

            {/* Desktop Filter Header */}
            <div className='hidden lg:block mb-6'>
              <h2 className='text-2xl font-bold text-[#3d2b1f]'>Filters</h2>
              <div className='w-12 h-1 bg-[#3d2b1f] mt-2 rounded-full'></div>
            </div>

            {/* Dynamic Filter Sections */}
            <div className={`space-y-4 ${showFilter ? 'block' : 'hidden'} lg:block`}>
              {Object.keys(filterOptions).map((filterType) => (
                <div key={filterType} className='bg-white rounded-xl shadow-sm border border-[#e8dccf] overflow-hidden'>
                  <div className='bg-gradient-to-r from-[#3d2b1f] to-[#5a3c2c] px-6 py-4'>
                    <h3 className='text-white font-semibold text-sm uppercase tracking-wide'>
                      {filterType === 'category' ? 'Categories' : 
                       filterType === 'subCategory' ? 'Type' : 
                       filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </h3>
                  </div>
                  <div className='p-6 space-y-3'>
                    {filterOptions[filterType].map((value) => (
                      <label key={value} className='flex items-center space-x-3 cursor-pointer group'>
                        <input 
                          className='w-4 h-4 text-[#3d2b1f] border-2 border-[#e8dccf] rounded focus:ring-2 focus:ring-[#3d2b1f] focus:ring-offset-0' 
                          type="checkbox" 
                          checked={activeFilters[filterType]?.includes(value) || false}
                          onChange={() => toggleFilter(filterType, value)}
                        />
                        <span className='text-sm font-medium text-[#3d2b1f] group-hover:text-[#5a3c2c] transition-colors'>
                          {value}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {/* Clear Filters Button */}
              {Object.values(activeFilters).some(values => values.length > 0) && (
                <button 
                  onClick={() => setActiveFilters({})}
                  className='w-full py-3 px-4 bg-[#3d2b1f] text-white rounded-lg hover:bg-[#5a3c2c] transition-colors font-medium text-sm'
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Main Content Area */}
          <div className='flex-1 min-w-0'>
            
            {/* Enhanced Header Section */}
            <div className='bg-white rounded-xl shadow-sm border border-[#e8dccf] p-6 mb-6'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                  <h1 className='text-3xl font-bold text-[#3d2b1f] mb-2'>All Collections</h1>
                  <p className='text-gray-600 text-sm'>
                    {filterProducts.length} {filterProducts.length === 1 ? 'item' : 'items'} found
                    {Object.values(activeFilters).some(values => values.length > 0) && (
                      <span className='ml-2 text-[#3d2b1f] font-medium'>
                        • {Object.values(activeFilters).reduce((total, values) => total + values.length, 0)} filter{Object.values(activeFilters).reduce((total, values) => total + values.length, 0) > 1 ? 's' : ''} applied
                      </span>
                    )}
                  </p>
                </div>
                
                {/* Enhanced Sort Dropdown */}
                <div className='flex items-center gap-3'>
                  <label className='text-sm font-medium text-[#3d2b1f]'>Sort by:</label>
                  <select 
                    onChange={(e)=>setSortType(e.target.value)} 
                    value={sortType}
                    className='bg-white border-2 border-[#e8dccf] text-[#3d2b1f] text-sm px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#3d2b1f] focus:border-transparent transition-all duration-200 hover:border-[#3d2b1f] min-w-[180px]'
                  >
                    <option value="relevant">Relevance</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Enhanced Product Grid */}
            {filterProducts.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6'>
                {filterProducts.map((item,index)=>(
                  <ProductItem 
                    key={item._id || index} 
                    name={item.name} 
                    id={item._id} 
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
            ) : (
              /* Enhanced Empty State */
              <div className='bg-white rounded-xl shadow-sm border border-[#e8dccf] p-12 text-center'>
                <div className='max-w-md mx-auto'>
                  <div className='w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center'>
                    <svg className='w-10 h-10 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                    </svg>
                  </div>
                  <h3 className='text-xl font-semibold text-[#3d2b1f] mb-2'>No products found</h3>
                  <p className='text-gray-600 mb-6'>
                    {search ? 
                      `No products match your search for "${search}"` : 
                      'No products match your current filters'
                    }
                  </p>
                  <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                    {search && (
                      <button 
                        onClick={() => window.location.reload()} 
                        className='px-6 py-2 bg-[#3d2b1f] text-white rounded-lg hover:bg-[#5a3c2c] transition-colors font-medium'
                      >
                        Clear Search
                      </button>
                    )}
                    {Object.values(activeFilters).some(values => values.length > 0) && (
                      <button 
                        onClick={() => setActiveFilters({})}
                        className='px-6 py-2 border-2 border-[#3d2b1f] text-[#3d2b1f] rounded-lg hover:bg-[#3d2b1f] hover:text-white transition-colors font-medium'
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Collection
