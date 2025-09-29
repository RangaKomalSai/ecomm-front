import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faStar, faBox, faLeaf } from '@fortawesome/free-solid-svg-icons'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [progress, setProgress] = useState(0)

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
      setProgress(0) // Reset progress when slide changes
      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentSlide((current) => (current + 1) % slides.length)
            return 0
          }
          return prev + 2 // 2% every 100ms = 100% in 5 seconds
        })
      }, 100)

      return () => clearInterval(progressTimer)
    }
  }, [slides.length, isHovered, currentSlide])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setProgress(0) // Reset progress when manually changing slides
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setProgress(0) // Reset progress when manually changing slides
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setProgress(0) // Reset progress when manually changing slides
  }

  return (
    <div 
      className='relative bg-[#fdf7f0] overflow-hidden w-screen -ml-[calc(50vw-50%)] h-screen'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Full Width Carousel Container */}
      <div className='flex transition-transform duration-500 ease-in-out h-full' style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className='w-full flex-shrink-0 relative h-full'>
            {/* Background Image with Overlay */}
            <div className='absolute inset-0'>
              <img 
                className='w-full h-full object-cover' 
                src={slide.image} 
                alt={slide.title}
                draggable={false}
              />
              {/* Gradient Overlay for better text readability */}
              <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent'></div>
            </div>

            {/* Content Overlay */}
            <div className='relative z-10 flex items-center h-full'>
              <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='max-w-2xl lg:max-w-3xl animate-fade-in-up ml-16 sm:ml-20 lg:ml-24'>
                  {/* Brand Badge */}
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='w-12 h-[3px] bg-gradient-to-r from-white to-[#e8dccf]'></div>
                    <span className='font-semibold text-sm tracking-wider text-white uppercase'>VESPER</span>
                  </div>
                  
                  {/* Main Title */}
                  <h1 className='prata-regular text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-4 text-white'>
                    {slide.title}
                  </h1>
                  
                  {/* Subtitle */}
                  <p className='text-lg lg:text-xl font-medium mb-4 text-white/90 leading-relaxed'>
                    {slide.subtitle}
                  </p>
                  
                  {/* Description */}
                  <p className='text-base lg:text-lg mb-6 text-white/80 leading-relaxed max-w-2xl'>
                    {slide.description}
                  </p>
                  
                  {/* Tagline with Icon */}
                  <div className='flex items-center gap-3 mb-8'>
                    <FontAwesomeIcon 
                      icon={slide.icon} 
                      className='w-4 h-4 text-white' 
                    />
                    <p className='text-base font-semibold text-white italic'>
                      {slide.tagline}
                    </p>
                  </div>
                  
                  {/* CTA Button */}
                  <div className='flex items-center gap-4'>
                    <button 
                      onClick={() => window.location.href = '/collection'}
                      className='bg-white text-[#3d2b1f] px-6 py-3 rounded-xl hover:bg-[#f5ece3] transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105'
                    >
                      EXPLORE COLLECTION
                    </button>
                    <div className='w-16 h-[2px] bg-gradient-to-r from-white to-transparent'></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows - Enhanced for overlay design */}
      <button
        onClick={goToPrevious}
        className='absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-[#3d2b1f] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xl backdrop-blur-sm z-20'
      >
        <FontAwesomeIcon icon={faChevronLeft} className='w-5 h-5 sm:w-6 sm:h-6' />
      </button>
      
      <button
        onClick={goToNext}
        className='absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-[#3d2b1f] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xl backdrop-blur-sm z-20'
      >
        <FontAwesomeIcon icon={faChevronRight} className='w-5 h-5 sm:w-6 sm:h-6' />
      </button>
      
      {/* Progress Bar */}
      <div className='absolute bottom-0 left-0 w-full h-1 bg-white/20 z-30'>
        <div 
          className='h-full bg-white/80 transition-all duration-100 ease-linear'
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Enhanced Slide Indicators */}
      <div className='absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20'>
        <div className='bg-white/90 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-xl'>
          <div className='flex space-x-2 sm:space-x-3'>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-[#3d2b1f] shadow-lg scale-125' 
                    : 'bg-gray-400 hover:bg-gray-500'
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
