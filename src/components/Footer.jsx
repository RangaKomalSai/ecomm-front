import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>
            Apparently is India's first technology-driven fashion rental marketplace, making premium style affordable, accessible, and sustainable. We partner with brands and individuals to unlock underutilized wardrobes, offering curated outfits with our Pristine Promise of hygiene and quality.</p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li><Link to='/' onClick={scrollToTop} className='hover:text-black transition-colors'>Home</Link></li>
                <li><Link to='/about' onClick={scrollToTop} className='hover:text-black transition-colors'>About us</Link></li>
                <li><Link to='/shipping' onClick={scrollToTop} className='hover:text-black transition-colors'>Shipping</Link></li>
                <li><Link to='/privacy' onClick={scrollToTop} className='hover:text-black transition-colors'>Privacy Policy</Link></li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>POLICIES</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li><Link to='/terms' onClick={scrollToTop} className='hover:text-black transition-colors'>Terms of Service</Link></li>
                <li><Link to='/refund' onClick={scrollToTop} className='hover:text-black transition-colors'>Refund Policy</Link></li>
                <li><Link to='/contact' onClick={scrollToTop} className='hover:text-black transition-colors'>Contact Us</Link></li>
                <li>+91-99999 99999</li>
            </ul>
        </div>

      </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright &copy; 2025. All Rights Reserved.</p>
        </div>

    </div>
  )
}

export default Footer
