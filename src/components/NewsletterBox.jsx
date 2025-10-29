import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const NewsletterBox = () => {

    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { backendUrl } = useContext(ShopContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        if (!email.trim()) {
            toast.error('Please enter a valid email address')
            return
        }

        setIsLoading(true)
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Show coming soon message
        toast.info('Thanks for showing interest in us! We will be starting this service soon.')
        setEmail('')
        setIsLoading(false)
    }

  return (
    <div className='text-[#3d2b1f] py-16 px-6'>
      <div className='max-w-4xl mx-auto text-center'>
        <div className='mb-8'>
          <h2 className='text-3xl lg:text-4xl font-semibold mb-4 text-[#3d2b1f]'>
            Subscribe now & get 20% off
          </h2>
          <p className='text-lg text-[#3d2b1f] opacity-80 max-w-2xl mx-auto'>
            Unlock premium fashion at a fraction of the price - join today and save
          </p>
        </div>
        
        <form onSubmit={onSubmitHandler} className='w-full max-w-md mx-auto'>
          <div className='flex flex-col sm:flex-row gap-3 bg-white rounded-xl p-2 shadow-lg'>
            <input 
              className='flex-1 px-4 py-3 outline-none text-[#3d2b1f] placeholder-gray-400 rounded-lg' 
              type="email" 
              placeholder='Enter your email' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <button 
              type='submit' 
              className='bg-[#3d2b1f] text-[#fdf7f0] px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#5a3c2c] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap'
              disabled={isLoading}
            >
              {isLoading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewsletterBox
