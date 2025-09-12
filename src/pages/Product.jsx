import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, navigate, token, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [rentalDays, setRentalDays] = useState(2)
  const [startDate, setStartDate] = useState('')
  const [selectedSize, setSelectedSize] = useState('')

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })

  }

  useEffect(() => {
    fetchProductData();
  }, [productId,products])

  const calculateEndDate = () => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + rentalDays);
    return end.toISOString().split('T')[0];
  }

  const calculateTotalPrice = () => {
    if (!productData?.rentalPricePerDay) return 0;
    return productData.rentalPricePerDay * rentalDays;
  }

  const handleAddToCart = async () => {
    if (!startDate) {
      toast.error('Please select a start date');
      return;
    }

    if (rentalDays < 1) {
      toast.error('Rental duration must be at least 1 day');
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    // Check if selected size is available
    const sizeAvailable = productData.sizes?.find(size => size.size === selectedSize && size.available);
    if (!sizeAvailable) {
      toast.error('Selected size is not available');
      return;
    }

    // Create rental data object
    const rentalData = {
      rentalDays,
      startDate,
      endDate: calculateEndDate(),
      totalPrice: calculateTotalPrice(),
      selectedSize
    };

    // Add to cart with rental data
    await addToCart(productData._id, rentalData);
  }

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*----------- Product Data-------------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/*---------- Product Images------------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {
                productData.image.map((item,index)=>(
                  <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
                ))
              }
          </div>
          <div className='w-full sm:w-[80%]'>
              <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-2'>
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
            <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium mt-2'>
              Pristine Promise
            </span>
          </div>
          
          <div className=' flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className='pl-2'>(122)</p>
          </div>

          <div className='mt-5'>
            <p className='text-3xl font-medium'>{currency}{productData.rentalPricePerDay}<span className='text-base font-normal text-gray-500'>/day</span></p>
          </div>

          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          {/* Owner Info */}
          <div className='bg-gray-50 p-4 rounded-lg mt-5'>
            <h3 className='font-medium text-sm mb-2'>Owner Information</h3>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
                <span className='text-xs font-medium'>{(productData.ownerName || 'VR')[0]}</span>
              </div>
              <div>
                <p className='text-sm font-medium'>{productData.ownerName || 'Vesper Rental'}</p>
                <p className='text-xs text-gray-500'>Verified Owner</p>
              </div>
            </div>
          </div>

          {/* Size Selection */}
          {productData.sizes && productData.sizes.length > 0 && (
            <div className='flex flex-col gap-2 my-6'>
              <p className='font-medium'>Select Size</p>
              <div className='flex flex-wrap gap-2'>
                {productData.sizes.map((sizeOption, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(sizeOption.size)}
                    disabled={!sizeOption.available}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedSize === sizeOption.size
                        ? 'bg-black text-white border-black'
                        : sizeOption.available
                        ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {sizeOption.size}
                    {!sizeOption.available && ' (Out of Stock)'}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className='text-sm text-gray-600'>Selected: {selectedSize}</p>
              )}
            </div>
          )}

          {/* Rental Duration and Date Selection */}
          <div className='flex flex-col gap-4 my-8'>
              <div className='flex flex-col gap-2'>
                <p>Rental Duration</p>
                <select 
                  value={rentalDays} 
                  onChange={(e) => setRentalDays(Number(e.target.value))}
                  className='border py-2 px-3 bg-gray-100 max-w-48'
                >
                  {[...Array(14)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} day{i + 1 > 1 ? 's' : ''} {i + 1 == 2 ? '(Recommended)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex flex-col gap-2'>
                <p>Start Date</p>
                <input 
                  type="date" 
                  value={startDate}
                  min={getMinDate()}
                  onChange={(e) => setStartDate(e.target.value)}
                  className='border py-2 px-3 bg-gray-100 max-w-48'
                />
                {startDate && (
                  <p className='text-xs text-gray-500'>Return by: {calculateEndDate()}</p>
                )}
              </div>
          </div>

          <button 
            onClick={handleAddToCart} 
            className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 hover:bg-gray-800 transition-colors'
          >
            ADD TO CART
          </button>
          
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>✓ Professionally cleaned and sanitized</p>
              <p>✓ Quality checked before each rental</p>
              <p>✓ Free pickup and delivery</p>
              <p>✓ Damage protection included</p>
          </div>
        </div>
      </div>

      {/* ---------- Description & Review Section ------------- */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>Vesper is your premier fashion rental marketplace, offering access to premium clothing and accessories without the commitment of ownership. Our rental model promotes sustainable fashion while providing affordable access to high-quality, designer pieces for special occasions or everyday wear.</p>
          <p>Each item in our collection undergoes rigorous quality checks and professional cleaning with our Pristine Promise guarantee. Rent from verified owners and individuals to discover unique styles, reduce your environmental footprint, and enjoy variety in your wardrobe at a fraction of retail cost.</p>
        </div>
      </div>

      {/* --------- display related products ---------- */}

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className=' opacity-0'></div>
}

export default Product
