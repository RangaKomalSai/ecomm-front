import React from 'react'
import Title from './Title'

const PolicyPage = ({ title, content, lastUpdated = "2025" }) => {
  return (
    <div className='border-t border-[#e8dccf] pt-16 bg-[#fdf7f0] text-[#3d2b1f]'>
      <div className='text-2xl mb-8'>
        <h1 className='font-bold text-[#3d2b1f]'>{title.toUpperCase()}</h1>
      </div>
      
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white p-8 rounded-lg shadow-sm'>
          <div className='prose prose-gray max-w-none'>
            {content}
          </div>
          
          <div className='mt-8 pt-6 border-t border-gray-200'>
            <p className='text-sm text-gray-500'>
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PolicyPage
