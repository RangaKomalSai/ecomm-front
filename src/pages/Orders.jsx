import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {

  const { backendUrl, token , currency} = useContext(ShopContext);

  const [orderData,setorderData] = useState([])

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}})
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setorderData(allOrdersItem.reverse())
      }
      
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    loadOrderData()
  },[token])

  return (
    <div className='border-t border-[#e8dccf] pt-16 bg-[#fdf7f0] text-[#3d2b1f]'>

        <div className='text-2xl mb-8'>
            <h1 className='font-bold text-[#3d2b1f]'>MY ORDERS</h1>
        </div>

        <div>
            {
              orderData.map((item,index) => (
                <div key={index} className='py-4 border-t border-b border-[#e8dccf] bg-white text-[#3d2b1f] flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition-shadow'>
                    <div className='flex items-start gap-6 text-sm'>
                        <img className='w-16 sm:w-20 rounded-lg shadow-sm' src={item.image[0]} alt="" draggable={false} />
                        <div>
                          <p className='sm:text-base font-medium text-[#3d2b1f]'>{item.name}</p>
                          <div className='flex items-center gap-3 mt-1 text-base text-[#3d2b1f]'>
                            <p>{currency}{item.rentalData?.totalPrice || item.price}</p>
                            <p>Duration: {item.rentalData?.rentalDays || 'N/A'} days</p>
                            <p>Period: {item.rentalData?.startDate ? new Date(item.rentalData.startDate).toLocaleDateString() : 'N/A'} - {item.rentalData?.endDate ? new Date(item.rentalData.endDate).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <p className='mt-1 text-[#3d2b1f]'>Date: <span className=' text-[#3d2b1f] opacity-60'>{new Date(item.date).toDateString()}</span></p>
                          <p className='mt-1 text-[#3d2b1f]'>Payment: <span className=' text-[#3d2b1f] opacity-60'>{item.paymentMethod}</span></p>
                        </div>
                    </div>
                    <div className='md:w-1/2 flex justify-between'>
                        <div className='flex items-center gap-2'>
                            <p className='min-w-2 h-2 rounded-full bg-[#5a3c2c]'></p>
                            <p className='text-sm md:text-base text-[#3d2b1f]'>{item.status}</p>
                        </div>
                        <button onClick={loadOrderData} className='border border-[#3d2b1f] bg-[#3d2b1f] text-[#fdf7f0] px-4 py-2 text-sm font-medium rounded-sm hover:bg-[#5a3c2c] hover:border-[#5a3c2c] transition-colors'>Track Order</button>
                    </div>
                </div>
              ))
            }
        </div>
    </div>
  )
}

export default Orders
