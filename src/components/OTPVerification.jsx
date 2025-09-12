import React, { useState, useEffect, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'

const OTPVerification = ({ email, onSuccess, onBack, onResend }) => {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds cooldown
  const [canResend, setCanResend] = useState(false)
  const { backendUrl } = useContext(ShopContext)

  // Countdown timer for resend OTP
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow numbers
    if (value.length <= 6) {
      setOtp(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(backendUrl + '/api/user/verify-otp', {
        email,
        otp
      })

      if (response.data.success) {
        toast.success('Account created successfully! Welcome to Vesper!')
        onSuccess(response.data.token)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'OTP verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setIsLoading(true)
    try {
      await onResend()
      setTimeLeft(60)
      setCanResend(false)
      toast.success('OTP resent to your email')
    } catch (error) {
      toast.error('Failed to resend OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>Verify Email</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      
      <div className='text-center mb-6'>
        <p className='text-gray-600 mb-2'>We've sent a verification code to</p>
        <p className='font-medium text-gray-800'>{email}</p>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col items-center w-full gap-4'>
        <div className='w-full'>
          <input 
            onChange={handleOTPChange}
            value={otp} 
            type="text" 
            className='w-full px-3 py-2 border border-gray-800 text-center text-2xl tracking-widest' 
            placeholder='000000' 
            maxLength="6"
            required
            autoComplete="one-time-code"
          />
          <p className='text-xs text-gray-500 mt-1'>Enter the 6-digit code sent to your email</p>
        </div>
        
        <div className='w-full flex justify-between text-sm mt-2'>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className={`${
              canResend && !isLoading
                ? 'text-blue-600 hover:text-blue-800 cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Sending...' : canResend ? 'Resend OTP' : `Resend in ${timeLeft}s`}
          </button>
          <button
            type="button"
            onClick={onBack}
            className='text-gray-600 hover:text-gray-800 cursor-pointer'
          >
            Change Email
          </button>
        </div>
        
        <button 
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className={`w-full px-8 py-2 mt-4 ${
            isLoading || otp.length !== 6 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-black hover:bg-gray-800'
          } text-white font-light transition-colors`}
        >
          {isLoading ? 'Verifying...' : 'Verify & Create Account'}
        </button>
      </form>

      {/* Security Notice */}
      <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
        <div className='flex items-start gap-2'>
          <FontAwesomeIcon icon={faLock} className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0' />
          <div className='text-sm text-blue-800'>
            <p className='font-medium mb-1'>Security Notice</p>
            <p className='text-xs'>
              This OTP is valid for 10 minutes. Never share your OTP with anyone. 
              Vesper will never ask for your OTP via phone or email.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OTPVerification
