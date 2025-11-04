import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTshirt, 
  faTruck, 
  faCrown, 
  faRotate 
} from '@fortawesome/free-solid-svg-icons'

const RentalFeatures = () => {
  const features = [
    {
      icon: faTshirt,
      title: 'Choose your outfit',
      description: 'Browse our curated collection of premium fashion pieces'
    },
    {
      icon: faTruck,
      title: 'Delivery to your doorstep',
      description: 'Fast and secure delivery right to your home'
    },
    {
      icon: faCrown,
      title: 'Own your look',
      description: 'Wear designer pieces and make a statement'
    },
    {
      icon: faRotate,
      title: 'Return hassle free and repeat',
      description: 'Easy returns and rent again for endless style options'
    }
  ]

  return (
    <div className='bg-[#fdf7f0] py-12 px-6 border-y border-[#e8dccf]'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-8 md:mb-10'>
          <h2 className='text-2xl md:text-3xl font-bold text-[#3d2b1f] mb-2'>
            How It Works
          </h2>
          <p className='text-sm md:text-base text-[#3d2b1f] opacity-80'>
            4 Simple Steps to Your Perfect Look
          </p>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8'>
          {features.map((feature, index) => (
            <div 
              key={index}
              className='flex flex-col items-center text-center group'
            >
              <div className='w-12 h-12 bg-[#3d2b1f] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300'>
                <FontAwesomeIcon 
                  icon={feature.icon} 
                  className='w-6 h-6 text-[#fdf7f0]' 
                />
              </div>
              <h3 className='text-sm md:text-base font-semibold mb-2 text-[#3d2b1f]'>
                {feature.title}
              </h3>
              <p className='text-xs md:text-sm text-[#3d2b1f] opacity-70 leading-relaxed'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RentalFeatures

