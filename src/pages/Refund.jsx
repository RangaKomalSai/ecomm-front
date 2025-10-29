import React from 'react'
import PolicyPage from '../components/PolicyPage'

const Refund = () => {
  const content = (
    <div className=' text-[#3d2b1f]'>
      <p className='mb-6 text-[#3d2b1f] opacity-80'>
        At Vesper, transparency is important to us. Please review our Refund & Cancellation Policy carefully before proceeding with any rental or subscription.
      </p>

      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>1. Subscription Plans</h2>
      <ul className='list-disc pl-6 mb-4 text-[#3d2b1f] opacity-80'>
        <li>Subscriptions are billed monthly, quarterly, or annually as chosen.</li>
        <li>Cancellations are effective from the next billing cycle; no partial refunds for the current cycle.</li>
      </ul>

      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>2. On-Demand Rentals</h2>
      <ul className='list-disc pl-6 mb-4 text-[#3d2b1f] opacity-80'>
        <li>Orders can be canceled before dispatch for a full refund.</li>
        <li>If already dispatched, only shipping and handling fees will be deducted upon return.</li>
      </ul>

      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>3. Refund Timeline</h2>
      <p className='mb-4 text-[#3d2b1f] opacity-80'>
        Approved refunds will be processed within 7–10 business days to the original payment method.
      </p>

      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>4. Non-Refundable Items</h2>
      <ul className='list-disc pl-6 mb-4 text-[#3d2b1f] opacity-80'>
        <li>Used rentals after the event date are non-refundable.</li>
        <li>Garments returned late, damaged, or missing accessories will not qualify for refunds.</li>
      </ul>
    </div>
  )

  return (
    <PolicyPage 
      title="Refund & Cancellation Policy" 
      content={content}
      lastUpdated="September 2025"
    />
  )
}

export default Refund
