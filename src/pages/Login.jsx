import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import OTPVerification from '../components/OTPVerification';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name,setName] = useState('')
  const [password,setPassword] = useState('')
  const [email,setEmail] = useState('')

  // Validate IITB email
  const validateIITBEmail = (email) => {
    return email.endsWith('@iitb.ac.in');
  }

  // Validate password strength
  const validatePassword = (password) => {
    return password.length >= 8;
  }

  const onSubmitHandler = async (event) => {
      event.preventDefault();
      setIsLoading(true);
      
      try {
        if (currentState === 'Sign Up') {
          // Validate IITB email
          if (!validateIITBEmail(email)) {
            toast.error('Only IIT Bombay email addresses (@iitb.ac.in) are allowed');
            setIsLoading(false);
            return;
          }

          // Validate password strength
          if (!validatePassword(password)) {
            toast.error('Password must be at least 8 characters long');
            setIsLoading(false);
            return;
          }

          // Send OTP for registration
          const response = await axios.post(backendUrl + '/api/user/register', {
            name, 
            email, 
            password
          });
          
          if (response.data.success) {
            setOtpSent(true);
            setOtpData({ name, email, password });
            toast.success('OTP sent to your email. Please check and verify.');
          } else {
            toast.error(response.data.message);
          }

        } else {
          // Login
          const response = await axios.post(backendUrl + '/api/user/login', {email,password})
          if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem('token',response.data.token)
            toast.success('Login successful!');
            navigate('/');
          } else {
            toast.error(response.data.message)
          }
        }

      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || error.message || 'An error occurred')
      } finally {
        setIsLoading(false);
      }
  }

  const handleOTPSuccess = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
    navigate('/');
  }

  const handleOTPBack = () => {
    setOtpSent(false);
    setOtpData(null);
  }

  const resendOTP = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/user/register', {
        name: otpData.name,
        email: otpData.email,
        password: otpData.password
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  useEffect(()=>{
    if (token) {
      navigate('/')
    }
  },[token])

  // If OTP is sent, show OTP verification component
  if (otpSent) {
    return (
      <OTPVerification
        email={otpData?.email}
        onSuccess={handleOTPSuccess}
        onBack={handleOTPBack}
        onResend={resendOTP}
      />
    );
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
            <p className='prata-regular text-3xl'>{currentState}</p>
            <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        
        {currentState === 'Sign Up' && (
          <div className='w-full'>
            <input 
              onChange={(e)=>setName(e.target.value)} 
              value={name} 
              type="text" 
              className='w-full px-3 py-2 border border-gray-800' 
              placeholder='Full Name' 
              required
            />
          </div>
        )}
        
        <div className='w-full'>
          <input 
            onChange={(e)=>setEmail(e.target.value)} 
            value={email} 
            type="email" 
            className='w-full px-3 py-2 border border-gray-800' 
            placeholder='Email (@iitb.ac.in)' 
            required
          />
          {currentState === 'Sign Up' && (
            <p className='text-xs text-gray-500 mt-1'>Only IIT Bombay email addresses are allowed</p>
          )}
        </div>
        
        <div className='w-full'>
          <input 
            onChange={(e)=>setPassword(e.target.value)} 
            value={password} 
            type="password" 
            className='w-full px-3 py-2 border border-gray-800' 
            placeholder='Password' 
            required
          />
          {currentState === 'Sign Up' && (
            <p className='text-xs text-gray-500 mt-1'>Password must be at least 8 characters long</p>
          )}
        </div>
        
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
            <p className='cursor-pointer text-gray-500'>Forgot your password?</p>
            {
              currentState === 'Login' 
              ? <p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer text-blue-600 hover:text-blue-800'>Create account</p>
              : <p onClick={()=>setCurrentState('Login')} className='cursor-pointer text-blue-600 hover:text-blue-800'>Login Here</p>
            }
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          className={`w-full px-8 py-2 mt-4 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-black hover:bg-gray-800'
          } text-white font-light transition-colors`}
        >
          {isLoading ? 'Processing...' : (currentState === 'Login' ? 'Sign In' : 'Send OTP')}
        </button>
    </form>
  )
}

export default Login
