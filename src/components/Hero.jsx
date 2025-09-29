import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faStar, faBox, faLeaf } from '@fortawesome/free-solid-svg-icons'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const slides = [
    {
      image: assets.hero_img1, // Group of stylish people
      title: "Your Style, Reimagined.",
      subtitle: "Why buy clothes you'll wear once?",
      description: "With Vesper's Rotating Wardrobe, access premium fashion for every occasion — without the cost, clutter, or commitment.",
      tagline: "Always fresh. Always you.",
      icon: faStar
    },
    {
      image: assets.hero_img2, // Vesper Box with clothes
      title: "Unbox Endless Possibilities.",
      subtitle: "Get curated outfits worth thousands, delivered to your doorstep — at just a fraction of the price.",
      description: "Swap as you need, and keep your wardrobe exciting all year round.",
      tagline: "Fashion made flexible.",
      icon: faBox
    },
    {
      image: assets.hero_img3, // Shirt with sustainability tagline
      title: "Fashion That Feels Good.",
      subtitle: "Join the circular fashion movement.",
      description: "Every rental reduces waste, saves money, and gives premium clothes a longer life.",
      tagline: "Look great. Live sustainably.",
      icon: faLeaf
    }
  ]

  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 5000) // Change slide every 5 seconds

      return () => clearInterval(timer)
    }
  }, [slides.length, isHovered])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <div 
      className='relative bg-[#fdf7f0] overflow-hidden'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Full Width Carousel Container */}
      <div className='flex transition-transform duration-500 ease-in-out' style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className='w-full flex-shrink-0 flex flex-col lg:flex-row min-h-[500px]'>
            {/* Left Side - Text Content */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16'>
              <div className='text-[#3d2b1f] max-w-2xl'>
                {/* Brand Badge */}
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-[3px] bg-gradient-to-r from-[#3d2b1f] to-[#5a3c2c]'></div>
                  <span className='font-semibold text-sm tracking-wider text-[#3d2b1f] uppercase'>VESPER</span>
                </div>
                
                {/* Main Title */}
                <h1 className='prata-regular text-4xl lg:text-6xl xl:text-7xl leading-tight mb-6 text-[#3d2b1f]'>
                  {slide.title}
                </h1>
                
                {/* Subtitle */}
                <p className='text-xl lg:text-2xl font-medium mb-6 text-[#5a3c2c] leading-relaxed'>
                  {slide.subtitle}
                </p>
                
                {/* Description */}
                <p className='text-lg lg:text-xl mb-8 text-[#3d2b1f] opacity-90 leading-relaxed max-w-xl'>
                  {slide.description}
                </p>
                
                {/* Tagline with Icon */}
                <div className='flex items-center gap-3 mb-10'>
                  <FontAwesomeIcon 
                    icon={slide.icon} 
                    className='w-5 h-5 text-[#5a3c2c]' 
                  />
                  <p className='text-lg font-semibold text-[#5a3c2c] italic'>
                    {slide.tagline}
                  </p>
                </div>
                
                {/* CTA Button */}
                <div className='flex items-center gap-4'>
                  <button 
                    onClick={() => window.location.href = '/collection'}
                    className='bg-[#3d2b1f] text-[#fdf7f0] px-8 py-4 rounded-xl hover:bg-[#5a3c2c] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105'
                  >
                    EXPLORE COLLECTION
                  </button>
                  <div className='w-16 h-[2px] bg-gradient-to-r from-[#3d2b1f] to-transparent'></div>
                </div>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className='w-full lg:w-1/2 relative'>
              <img 
                className='w-full h-[400px] lg:h-full object-cover' 
                src={slide.image} 
                alt={slide.title}
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows - Positioned on the sides */}
      <button
        onClick={goToPrevious}
        className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-[#3d2b1f] w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg'
      >
        <FontAwesomeIcon icon={faChevronLeft} className='w-5 h-5' />
      </button>
      
      <button
        onClick={goToNext}
        className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-[#3d2b1f] w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg'
      >
        <FontAwesomeIcon icon={faChevronRight} className='w-5 h-5' />
      </button>
      
      {/* Slide Indicators */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2'>
        {/* White background container */}
        <div className='bg-white bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm'>
          <div className='flex space-x-2'>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide 
                    ? 'bg-[#3d2b1f] shadow-sm scale-110' 
                    : 'bg-gray-400 bg-opacity-60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
