import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {

    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        // Check if it's rental data (object with rentalDays) or old size data
        if (typeof cartItems[items] === 'object' && cartItems[items].rentalDays) {
          tempData.push({
            _id: items,
            rentalData: cartItems[items],
            isRental: true
          })
        } else if (typeof cartItems[items] === 'object') {
          // Handle old size-based cart items
          for (const item in cartItems[items]) {
            if (cartItems[items][item] > 0) {
              tempData.push({
                _id: items,
                size: item,
                quantity: cartItems[items][item],
                isRental: false
              })
            }
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])

  return (
    <div className='border-t pt-14'>

      <div className=' text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {
          cartData.map((item, index) => {

            const productData = products.find((product) => product._id === item._id);

            return (
              <div key={index} className='py-4 border-t border-b text-gray-700'>
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                  <div className='flex-1'>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    
                    {item.isRental ? (
                      // Rental item display
                      <div className='mt-2 space-y-1'>
                        <div className='flex items-center gap-5'>
                          <p className='text-sm font-medium'>{currency}{item.rentalData.totalPrice}</p>
                          <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>Rental</span>
                        </div>
                        <div className='text-xs text-gray-500 space-y-1'>
                          <p>Duration: {item.rentalData.rentalDays} day{item.rentalData.rentalDays > 1 ? 's' : ''}</p>
                          <p>Start: {new Date(item.rentalData.startDate).toLocaleDateString()}</p>
                          <p>Return: {new Date(item.rentalData.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ) : (
                      // Regular purchase item display
                      <div className='flex items-center gap-5 mt-2'>
                        <p>{currency}{productData.price}</p>
                        <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                        <input 
                          onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} 
                          className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' 
                          type="number" 
                          min={1} 
                          defaultValue={item.quantity} 
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className='flex items-center gap-2'>
                    {!item.isRental && (
                      <img 
                        onClick={() => updateQuantity(item._id, item.size, 0)} 
                        className='w-4 sm:w-5 cursor-pointer' 
                        src={assets.bin_icon} 
                        alt="Remove" 
                      />
                    )}
                    {item.isRental && (
                      <img 
                        onClick={() => {
                          const newCartItems = { ...cartItems };
                          delete newCartItems[item._id];
                          // You might want to add a removeRentalItem function to context
                        }} 
                        className='w-4 sm:w-5 cursor-pointer' 
                        src={assets.bin_icon} 
                        alt="Remove" 
                      />
                    )}
                  </div>
                </div>
              </div>
            )

          })
        }
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className=' w-full text-end'>
            <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO RENT</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Cart
