import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faStar, faBox, faLeaf, faHeart, faRecycle } from '@fortawesome/free-solid-svg-icons'

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
    },
    {
      image: assets.hero_img4, // Woman in printed dress with circular fashion graphics
      title: "Smarter. Greener. Better.",
      subtitle: "Each rental means less waste, more wears, and premium fashion that's kind to the planet.",
      description: "Join the movement redefining how India wears fashion.",
      tagline: "Look stunning, live sustainably.",
      icon: faRecycle
    },
    {
      image: assets.hero_img5, // Woman twirling in vibrant dress
      title: "Fashion for Every Mood.",
      subtitle: "From weddings to weekends, parties to casual outings — your wardrobe evolves with you.",
      description: "Discover the joy of endless styles at your fingertips.",
      tagline: "Dress different, every time.",
      icon: faHeart
    },
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
      className='relative bg-[#fdf7f0] overflow-hidden w-screen -ml-[calc(50vw-50%)] h-[calc(100vh-140px)]'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Full Width Carousel Container */}
      <div className='flex transition-transform duration-500 ease-in-out h-full' style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className='w-full flex-shrink-0 relative h-full flex'>
            {/* Left Side - Text Content */}
            <div className='w-full md:w-1/2 flex items-center justify-center bg-[#fdf7f0] p-8 lg:p-12'>
              <div className='max-w-lg animate-fade-in-up pl-8 md:pl-12 lg:pl-16'>
                {/* Brand Badge */}
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-12 h-[3px] bg-gradient-to-r from-[#3d2b1f] to-[#8b7355]'></div>
                  <span className='font-semibold text-sm tracking-wider text-[#3d2b1f] uppercase'>VESPER</span>
                </div>
                
                {/* Main Title */}
                <h1 className='prata-regular text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-4 text-[#3d2b1f]'>
                  {slide.title}
                </h1>
                
                {/* Subtitle */}
                <p className='text-lg lg:text-xl font-medium mb-4 text-[#5a3c2c] leading-relaxed'>
                  {slide.subtitle}
                </p>
                
                {/* Description */}
                <p className='text-base lg:text-lg mb-6 text-[#6b4e3d] leading-relaxed'>
                  {slide.description}
                </p>
                
                {/* Tagline with Icon */}
                <div className='flex items-center gap-3 mb-8'>
                  <FontAwesomeIcon 
                    icon={slide.icon} 
                    className='w-4 h-4 text-[#3d2b1f]' 
                  />
                  <p className='text-base font-semibold text-[#3d2b1f] italic'>
                    {slide.tagline}
                  </p>
                </div>
                
                {/* CTA Button */}
                <div className='flex items-center gap-4'>
                  <button 
                    onClick={() => window.location.href = '/collection'}
                    className='bg-[#3d2b1f] text-white px-6 py-3 rounded-xl hover:bg-[#5a3c2c] transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105'
                  >
                    EXPLORE COLLECTION
                  </button>
                  <div className='w-16 h-[2px] bg-gradient-to-r from-[#3d2b1f] to-transparent'></div>
                </div>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className='hidden md:block w-1/2 relative'>
              <img 
                className='w-full h-full object-cover' 
                src={slide.image} 
                alt={slide.title}
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows - Outlined style, smaller on mobile */}
      <button
        onClick={goToPrevious}
        style={{ backgroundColor: 'transparent', borderColor: '#3d2b1f', color: '#3d2b1f' }}
        className='absolute left-1/2 md:left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 md:translate-x-0 md:left-4 lg:left-6 border-2 bg-transparent hover:bg-[#3d2b1f]/10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg backdrop-blur-sm z-20'
      >
        <FontAwesomeIcon icon={faChevronLeft} className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5' style={{ color: '#3d2b1f' }} />
      </button>
      
      <button
        onClick={goToNext}
        style={{ backgroundColor: 'transparent', borderColor: '#3d2b1f', color: '#3d2b1f' }}
        className='absolute right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 border-2 bg-transparent hover:bg-[#3d2b1f]/10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg backdrop-blur-sm z-20'
      >
        <FontAwesomeIcon icon={faChevronRight} className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5' style={{ color: '#3d2b1f' }} />
      </button>
      
      {/* Progress Bar */}
      <div className='absolute bottom-0 left-0 w-full h-1 bg-[#3d2b1f]/20 z-30'>
        <div 
          className='h-full bg-[#3d2b1f]/80 transition-all duration-100 ease-linear'
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
