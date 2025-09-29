import React from 'react'
import PolicyPage from '../components/PolicyPage'

const Terms = () => {
  const content = (
    <div className='bg-[#fdf7f0] text-[#3d2b1f]'>
      <p className='mb-6 text-[#3d2b1f] opacity-80'>
        Welcome to Vesper, India's premier fashion rental marketplace. These terms and conditions govern your use of our platform and services.
      </p>
      
      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>1. Acceptance of Terms</h2>
      <p className='mb-4 text-[#3d2b1f] opacity-80'>
        By accessing and using Vesper, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
      </p>
      
      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>2. Use License</h2>
      <p className='mb-4 text-[#3d2b1f] opacity-80'>
        Permission is granted to temporarily download one copy of the materials on Vesper for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
      </p>
      <ul className='list-disc pl-6 mb-4 text-[#3d2b1f] opacity-80'>
        <li>modify or copy the materials</li>
        <li>use the materials for any commercial purpose or for any public display</li>
        <li>attempt to reverse engineer any software contained on the website</li>
        <li>remove any copyright or other proprietary notations from the materials</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>3. Rental Terms</h2>
      <p className='mb-4 text-[#3d2b1f] opacity-80'>
        All items rented through Vesper are subject to our rental agreement. Users must:
      </p>
      <ul className='list-disc pl-6 mb-4 text-[#3d2b1f] opacity-80'>
        <li>Return items in the same condition as received</li>
        <li>Follow care instructions provided</li>
        <li>Return items by the specified due date</li>
        <li>Report any damages immediately</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>4. Payment Terms</h2>
      <p className='mb-4 text-[#3d2b1f] opacity-80'>
        All payments are processed securely through Razorpay. By making a payment, you agree to our payment terms and conditions. Refunds are subject to our refund policy.
      </p>
      
      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>5. Limitation of Liability</h2>
      <p className='mb-4 text-[#3d2b1f] opacity-80'>
        In no event shall Vesper or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Vesper, even if Vesper or a Vesper authorized representative has been notified orally or in writing of the possibility of such damage.
      </p>
      
      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>6. Contact Information</h2>
      <p className='mb-4 text-[#3d2b1f] opacity-80'>
        If you have any questions about these Terms of Service, please contact us at:
      </p>
      <p className='mb-2 text-[#3d2b1f] opacity-80'>Email: legal@vesper.com</p>
      <p className='mb-2 text-[#3d2b1f] opacity-80'>Phone: +91-99999 99999</p>
      <p className='mb-4 text-[#3d2b1f] opacity-80'>Address: 123 Street A, Mumbai, India</p>
    </div>
  )

  return (
    <PolicyPage 
      title="Terms of Service" 
      content={content}
      lastUpdated="January 2025"
    />
  )
}

export default Terms
