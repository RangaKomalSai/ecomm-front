import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope, faMapMarkerAlt, faHeart } from '@fortawesome/free-solid-svg-icons'

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const Footer = () => {
  return (
    <footer className='bg-[#f5ece3] text-[#3d2b1f] w-screen -ml-[calc(50vw-50%)] mt-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
          
          {/* Company Info */}
          <div className='lg:col-span-2'>
            <div className='flex items-center gap-3 mb-6'>
              <img src={assets.logo_icon} className='h-12' alt="Vesper Icon" draggable={false} />
              <img src={assets.logo_text} className='h-8' alt="Vesper" draggable={false} />
            </div>
            <p className='text-[#3d2b1f] opacity-80 leading-relaxed mb-6 max-w-lg'>
              Vesper is India's first technology-driven fashion rental marketplace, making premium style affordable, accessible, and sustainable. We partner with brands and individuals to unlock underutilized wardrobes, offering curated outfits with our Pristine Promise of hygiene and quality.
            </p>
            
            {/* Contact Info */}
            <div className='space-y-3'>
              <div className='flex items-center gap-3 text-[#3d2b1f] opacity-80'>
                <FontAwesomeIcon icon={faPhone} className='w-4 h-4 text-[#8b4513]' />
                <span>+91-99999 99999</span>
              </div>
              <div className='flex items-center gap-3 text-[#3d2b1f] opacity-80'>
                <FontAwesomeIcon icon={faEnvelope} className='w-4 h-4 text-[#8b4513]' />
                <span>admin@vesper.com</span>
              </div>
              <div className='flex items-center gap-3 text-[#3d2b1f] opacity-80'>
                <FontAwesomeIcon icon={faMapMarkerAlt} className='w-4 h-4 text-[#8b4513]' />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className='text-xl font-bold text-[#3d2b1f] mb-6'>Company</h3>
            <ul className='space-y-3'>
              <li>
                <Link 
                  to='/' 
                  onClick={scrollToTop} 
                  className='text-[#3d2b1f] opacity-80 hover:text-[#8b4513] hover:opacity-100 transition-all duration-300 flex items-center gap-2 group'
                >
                  <span className='w-1 h-1 bg-[#8b4513] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to='/about' 
                  onClick={scrollToTop} 
                  className='text-[#3d2b1f] opacity-80 hover:text-[#8b4513] hover:opacity-100 transition-all duration-300 flex items-center gap-2 group'
                >
                  <span className='w-1 h-1 bg-[#8b4513] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to='/shipping' 
                  onClick={scrollToTop} 
                  className='text-[#3d2b1f] opacity-80 hover:text-[#8b4513] hover:opacity-100 transition-all duration-300 flex items-center gap-2 group'
                >
                  <span className='w-1 h-1 bg-[#8b4513] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                  Shipping
                </Link>
              </li>
              <li>
                <Link 
                  to='/privacy' 
                  onClick={scrollToTop} 
                  className='text-[#3d2b1f] opacity-80 hover:text-[#8b4513] hover:opacity-100 transition-all duration-300 flex items-center gap-2 group'
                >
                  <span className='w-1 h-1 bg-[#8b4513] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies Links */}
          <div>
            <h3 className='text-xl font-bold text-[#3d2b1f] mb-6'>Policies</h3>
            <ul className='space-y-3'>
              <li>
                <Link 
                  to='/terms' 
                  onClick={scrollToTop} 
                  className='text-[#3d2b1f] opacity-80 hover:text-[#8b4513] hover:opacity-100 transition-all duration-300 flex items-center gap-2 group'
                >
                  <span className='w-1 h-1 bg-[#8b4513] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to='/refund' 
                  onClick={scrollToTop} 
                  className='text-[#3d2b1f] opacity-80 hover:text-[#8b4513] hover:opacity-100 transition-all duration-300 flex items-center gap-2 group'
                >
                  <span className='w-1 h-1 bg-[#8b4513] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link 
                  to='/contact' 
                  onClick={scrollToTop} 
                  className='text-[#3d2b1f] opacity-80 hover:text-[#8b4513] hover:opacity-100 transition-all duration-300 flex items-center gap-2 group'
                >
                  <span className='w-1 h-1 bg-[#8b4513] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to='/subscription-plans' 
                  onClick={scrollToTop} 
                  className='text-[#3d2b1f] opacity-80 hover:text-[#8b4513] hover:opacity-100 transition-all duration-300 flex items-center gap-2 group'
                >
                  <span className='w-1 h-1 bg-[#8b4513] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                  Subscription Plans
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-16 pt-8 border-t border-[#e8dccf]'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-sm text-[#3d2b1f] opacity-80'>
              Copyright &copy; 2025 Vesper. All Rights Reserved.
            </p>
            <div className='flex items-center gap-2 text-sm text-[#3d2b1f] opacity-80'>
              <span>Made with</span>
              <FontAwesomeIcon icon={faHeart} className='w-4 h-4 text-red-500' />
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
