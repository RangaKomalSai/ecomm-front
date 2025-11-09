import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faPhone, faEnvelope, faBriefcase } from '@fortawesome/free-solid-svg-icons'

const Contact = () => {
  return (
    <div className='bg-[#fdf7f0] text-[#3d2b1f] min-h-screen'>
      {/* Hero Section */}
      <div className='text-center py-16 px-4'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-[#3d2b1f] mb-4'>
            <span className='block'>CONTACT</span>
            <span className='block text-[#8b4513]'>US</span>
          </h1>
          <div className='w-32 h-1 bg-gradient-to-r from-[#3d2b1f] to-[#8b4513] mx-auto mt-6 rounded-full'></div>
          <p className='text-lg text-[#3d2b1f] opacity-80 mt-6 max-w-2xl mx-auto'>
            Get in touch with us - we'd love to hear from you
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch mb-16'>
          <div className='lg:w-1/2 flex items-center'>
            <img 
              className='w-full h-full object-cover rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105' 
              src={assets.contact_img} 
              alt="Contact Vesper" 
              draggable={false} 
            />
          </div>
          
          <div className='lg:w-1/2 flex flex-col gap-8'>
            {/* Store Information */}
            <div className='bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-12 h-12 bg-[#fdf7f0] rounded-full flex items-center justify-center'>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className='w-6 h-6 text-[#3d2b1f]' />
                </div>
                <h2 className='text-2xl font-bold text-[#3d2b1f]'>Reach Us</h2>
              </div>
              <div className='space-y-4'>
                {/* <div className='flex items-start gap-3'>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className='w-5 h-5 text-[#8b4513] mt-1' />
                  <div>
                    <p className='text-[#3d2b1f] font-medium'>123 Street A</p>
                    <p className='text-[#3d2b1f] opacity-80'>Mumbai, India</p>
                  </div>
                </div> */}
                <div className='flex items-start gap-3'>
                  <FontAwesomeIcon icon={faPhone} className='w-5 h-5 text-[#8b4513] mt-1' />
                  <p className='text-[#3d2b1f] opacity-80'>+91 81692 29349</p>
                </div>
                <div className='flex items-start gap-3'>
                  <FontAwesomeIcon icon={faEnvelope} className='w-5 h-5 text-[#8b4513] mt-1' />
                  <p className='text-[#3d2b1f] opacity-80'>connect@vesper.co.in</p>
                </div>
              </div>
            </div>

            {/* Careers Section */}
            <div className='bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-12 h-12 bg-[#fdf7f0] rounded-full flex items-center justify-center'>
                  <FontAwesomeIcon icon={faBriefcase} className='w-6 h-6 text-[#3d2b1f]' />
                </div>
                <h2 className='text-2xl font-bold text-[#3d2b1f]'>Careers at Vesper</h2>
              </div>
              <p className='text-[#3d2b1f] opacity-80 mb-6 leading-relaxed'>
                Learn more about our teams and job openings. Join us in revolutionizing the fashion industry.
              </p>
              <button 
                onClick={() => toast.info('We are currently not hiring. We\'ll open roles soon, please keep checking.')} 
                className='bg-[#3d2b1f] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#5a3c2c] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'
              >
                Explore Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <NewsletterBox/> */}
    </div>
  )
}

export default Contact
