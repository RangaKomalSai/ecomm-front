import React from 'react'
import Title from './Title'

const PolicyPage = ({ title, content, lastUpdated = "2025" }) => {
  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <Title text1={title.split(' ')[0]} text2={title.split(' ').slice(1).join(' ')} />
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
