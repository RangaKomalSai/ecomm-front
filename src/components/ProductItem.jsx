import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'

const ProductItem = ({id,image,name,rentalPricePerDay,originalPrice,discountType,isFree,displayPrice,originalDisplayPrice}) => {
    
    const {currency} = useContext(ShopContext);

  return (
    <Link onClick={()=>scrollTo(0,0)} className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className=' overflow-hidden'>
        <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt="" />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <div className='flex items-center gap-2'>
        {isFree ? (
          <p className='text-sm font-medium text-green-600'>Free</p>
        ) : (
          <>
            <p className='text-sm font-medium'>{currency}{rentalPricePerDay}<span className='text-xs text-gray-500'>/day</span></p>
            {discountType && originalPrice && originalPrice > rentalPricePerDay && (
              <div className='flex items-center gap-1'>
                <span className='text-xs text-gray-400 line-through'>{currency}{originalPrice}</span>
                <span className='text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded'>{discountType}</span>
              </div>
            )}
          </>
        )}
      </div>
    </Link>
  )
}

export default ProductItem
