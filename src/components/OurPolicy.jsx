import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShirt, faTruck, faRecycle, faStar } from '@fortawesome/free-solid-svg-icons'

const OurPolicy = () => {
  return (
    <div className='bg-[#f5ece3] py-20 px-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl lg:text-4xl font-semibold mb-4 text-[#3d2b1f]'>
            Why Choose Vesper?
          </h2>
          <p className='text-lg text-[#3d2b1f] opacity-80 max-w-3xl mx-auto'>
            Experience premium fashion without the commitment. Our rental model offers you endless possibilities while making a positive impact.
          </p>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          <div className='text-center group'>
            <div className='w-16 h-16 bg-[#3d2b1f] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
              <FontAwesomeIcon icon={faShirt} className='w-8 h-8 text-[#fdf7f0]' />
            </div>
            <h3 className='text-xl font-semibold mb-3 text-[#3d2b1f]'>Premium Quality</h3>
            <p className='text-[#3d2b1f] opacity-80 text-sm leading-relaxed'>
              Access designer and premium brands at a fraction of the retail price. Every piece is carefully curated and maintained.
            </p>
          </div>
          
          <div className='text-center group'>
            <div className='w-16 h-16 bg-[#3d2b1f] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
              <FontAwesomeIcon icon={faTruck} className='w-8 h-8 text-[#fdf7f0]' />
            </div>
            <h3 className='text-xl font-semibold mb-3 text-[#3d2b1f]'>Free Delivery</h3>
            <p className='text-[#3d2b1f] opacity-80 text-sm leading-relaxed'>
              Get your outfits delivered to your doorstep and picked up when done. No hassle, just pure convenience.
            </p>
          </div>
          
          <div className='text-center group'>
            <div className='w-16 h-16 bg-[#3d2b1f] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
              <FontAwesomeIcon icon={faRecycle} className='w-8 h-8 text-[#fdf7f0]' />
            </div>
            <h3 className='text-xl font-semibold mb-3 text-[#3d2b1f]'>Sustainable Fashion</h3>
            <p className='text-[#3d2b1f] opacity-80 text-sm leading-relaxed'>
              Join the circular fashion movement. Reduce waste, save water, and give clothes a longer life.
            </p>
          </div>
          
          <div className='text-center group'>
            <div className='w-16 h-16 bg-[#3d2b1f] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
              <FontAwesomeIcon icon={faStar} className='w-8 h-8 text-[#fdf7f0]' />
            </div>
            <h3 className='text-xl font-semibold mb-3 text-[#3d2b1f]'>Always Fresh</h3>
            <p className='text-[#3d2b1f] opacity-80 text-sm leading-relaxed'>
              Never wear the same outfit twice. Keep your wardrobe exciting with our rotating collection of styles.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OurPolicy
