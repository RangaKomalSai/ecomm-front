import React from 'react'
import PolicyPage from '../components/PolicyPage'

const Refund = () => {
  const content = (
    <div>
      <p className='mb-6 text-gray-700'>
        At Vesper, we strive to provide excellent service and ensure your satisfaction. This refund policy outlines the conditions under which refunds may be processed.
      </p>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>1. Refund Eligibility</h2>
      <p className='mb-4 text-gray-700'>
        Refunds may be issued in the following circumstances:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>Items received in damaged or defective condition</li>
        <li>Wrong items delivered due to our error</li>
        <li>Items not delivered within the promised timeframe</li>
        <li>Technical issues preventing rental completion</li>
        <li>Duplicate payments processed in error</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>2. Refund Process</h2>
      <p className='mb-4 text-gray-700'>
        To request a refund:
      </p>
      <ol className='list-decimal pl-6 mb-4 text-gray-700'>
        <li>Contact our customer support within 24 hours of the issue</li>
        <li>Provide your order number and detailed description of the problem</li>
        <li>Submit supporting evidence (photos, screenshots) if applicable</li>
        <li>Our team will review your request within 2-3 business days</li>
        <li>Approved refunds will be processed within 5-7 business days</li>
      </ol>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>3. Refund Methods</h2>
      <p className='mb-4 text-gray-700'>
        Refunds will be processed through the same payment method used for the original transaction:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>Razorpay payments: Refunded to original payment method</li>
        <li>Credit/Debit cards: Refunded to the card used</li>
        <li>UPI payments: Refunded to the UPI account</li>
        <li>Net banking: Refunded to the bank account</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>4. Non-Refundable Items</h2>
      <p className='mb-4 text-gray-700'>
        The following are not eligible for refunds:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>Rental fees for items returned in damaged condition</li>
        <li>Late return fees</li>
        <li>Cleaning fees for items requiring special care</li>
        <li>Items damaged due to customer negligence</li>
        <li>Refund requests made after 7 days of rental completion</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>5. Partial Refunds</h2>
      <p className='mb-4 text-gray-700'>
        In certain cases, we may offer partial refunds:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>Minor damages that don't affect item usability</li>
        <li>Delays in delivery that don't significantly impact your plans</li>
        <li>Service issues that are partially resolved</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>6. Processing Time</h2>
      <p className='mb-4 text-gray-700'>
        Refund processing times vary by payment method:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>Razorpay: 5-7 business days</li>
        <li>Credit/Debit cards: 7-10 business days</li>
        <li>UPI: 3-5 business days</li>
        <li>Net banking: 5-7 business days</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>7. Contact Support</h2>
      <p className='mb-4 text-gray-700'>
        For refund inquiries or assistance, contact us:
      </p>
      <p className='mb-2 text-gray-700'>Email: support@vesper.com</p>
      <p className='mb-2 text-gray-700'>Phone: +91-99999 99999</p>
      <p className='mb-4 text-gray-700'>Address: 123 Street A, Mumbai, India</p>
    </div>
  )

  return (
    <PolicyPage 
      title="Refund Policy" 
      content={content}
      lastUpdated="January 2025"
    />
  )
}

export default Refund
