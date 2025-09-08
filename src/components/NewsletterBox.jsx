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
    <div className=' text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
      <p className='text-gray-400 mt-3'>
      Unlock premium fashion at a fraction of the price - join today and save
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input 
          className='w-full sm:flex-1 outline-none' 
          type="email" 
          placeholder='Enter your email' 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <button 
          type='submit' 
          className='bg-black text-white text-xs px-10 py-4 disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={isLoading}
        >
          {isLoading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
        </button>
      </form>
    </div>
  )
}

export default NewsletterBox
