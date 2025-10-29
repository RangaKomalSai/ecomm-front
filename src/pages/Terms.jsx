import React from 'react'
import PolicyPage from '../components/PolicyPage'

const Terms = () => {
  const content = (
    <div className='text-[#3d2b1f]'>
      <p className='mb-6 text-[#3d2b1f] opacity-80'>
        Welcome to Vesper, India’s premier fashion rental marketplace. Please read these Terms of Service carefully before using our platform.
      </p>

      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>1. Acceptance of Terms</h2>
      <p className='mb-4 text-[#3d2b1f] opacity-80'>
        By accessing or using Vesper’s services, you agree to abide by these Terms of Service (“Terms”). If you do not agree, you may not use our platform.
      </p>

      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>2. Eligibility</h2>
      <p className='mb-4 text-[#3d2b1f] opacity-80'>
        You must be at least 18 years of age and legally capable of entering into binding agreements.
      </p>

      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>3. Services</h2>
      <p className='mb-4 text-[#3d2b1f] opacity-80'>
        Vesper is a fashion rental marketplace that allows users to rent garments and accessories under subscription plans, on-demand rentals, or through curated programs.
      </p>

      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>4. User Responsibilities</h2>
      <ul className='list-disc pl-6 mb-4 text-[#3d2b1f] opacity-80'>
        <li>You agree to handle rented garments with reasonable care.</li>
        <li>You agree to return garments on or before the due date.</li>
        <li>You will not use garments for unlawful, hazardous, or reputationally damaging purposes.</li>
      </ul>

      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>5. Pricing & Payments</h2>
      <ul className='list-disc pl-6 mb-4 text-[#3d2b1f] opacity-80'>
        <li>Rental fees, subscription charges, deposits, and penalties are disclosed at checkout.</li>
        <li>Payments are processed securely through authorized payment partners.</li>
      </ul>

      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>6. Late Returns & Penalties</h2>
      <ul className='list-disc pl-6 mb-4 text-[#3d2b1f] opacity-80'>
        <li>Returns after the due date will incur a late fee per day as specified in your rental plan.</li>
        <li>Items not returned within 14 days of the due date will be considered a purchase, and you will be charged the item’s MRP minus any rental fees paid.</li>
      </ul>
    </div>
  )

  return (
    <PolicyPage 
      title="Terms of Service" 
      content={content}
      lastUpdated="September 2025"
    />
  )
}

export default Terms
