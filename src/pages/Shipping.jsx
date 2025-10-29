import React from 'react'
import PolicyPage from '../components/PolicyPage'

const Shipping = () => {
  const content = (
    <div>
      <p className='mb-6 text-gray-700'>
        At Vesper, we ensure safe and timely delivery of your rental items. This shipping policy outlines our delivery processes, timelines, and terms.
      </p>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>1. Delivery Areas</h2>
      <p className='mb-4 text-gray-700'>
        We currently deliver to:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>All major cities in India</li>
        <li>Metropolitan areas and tier-1 cities</li>
        <li>Selected tier-2 cities (check availability during checkout)</li>
        <li>International shipping available for select items</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>2. Delivery Timeline</h2>
      <p className='mb-4 text-gray-700'>
        Standard delivery times:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>Same city: 24-48 hours</li>
        <li>Metro cities: 2-3 business days</li>
        <li>Tier-2 cities: 3-5 business days</li>
        <li>Express delivery: 12-24 hours (additional charges apply)</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>3. Delivery Process</h2>
      <p className='mb-4 text-gray-700'>
        Our delivery process includes:
      </p>
      <ol className='list-decimal pl-6 mb-4 text-gray-700'>
        <li>Order confirmation and processing</li>
        <li>Item preparation and quality check</li>
        <li>Packaging in protective materials</li>
        <li>Dispatch with tracking information</li>
        <li>Delivery confirmation and receipt</li>
      </ol>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>4. Delivery Charges</h2>
      <p className='mb-4 text-gray-700'>
        Shipping costs:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>Standard delivery: ₹50 (free on orders above ₹2000)</li>
        <li>Express delivery: ₹150</li>
        <li>International shipping: ₹500-1000 (varies by destination)</li>
        <li>Return shipping: Included in rental fee</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>5. Delivery Requirements</h2>
      <p className='mb-4 text-gray-700'>
        To ensure successful delivery:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>Provide accurate and complete address details</li>
        <li>Ensure someone is available to receive the package</li>
        <li>Keep your phone accessible for delivery updates</li>
        <li>Have valid ID for verification if required</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>6. Failed Delivery</h2>
      <p className='mb-4 text-gray-700'>
        If delivery fails:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>We will attempt delivery 2 more times</li>
        <li>Items will be held at our facility for 3 days</li>
        <li>After 3 days, items will be returned to inventory</li>
        <li>Rental charges will be refunded minus processing fees</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>7. Return Shipping</h2>
      <p className='mb-4 text-gray-700'>
        Return process:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>Use provided return packaging and labels</li>
        <li>Schedule pickup through our app or website</li>
        <li>Items must be returned by the due date</li>
        <li>Late returns incur additional charges</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>8. Tracking Your Order</h2>
      <p className='mb-4 text-gray-700'>
        Track your delivery:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>Real-time tracking through our website</li>
        <li>SMS and email notifications</li>
        <li>Delivery partner tracking links</li>
        <li>Customer support assistance</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>9. Contact Us</h2>
      <p className='mb-4 text-gray-700'>
        For shipping inquiries or support:
      </p>
      <p className='mb-2 text-gray-700'>Email: shipping@vesper.com</p>
      <p className='mb-2 text-gray-700'>Phone: +91-99999 99999</p>
      <p className='mb-4 text-gray-700'>Address: 123 Street A, Mumbai, India</p>
    </div>
  )

  return (
    <PolicyPage 
      title="Shipping Policy" 
      content={content}
      lastUpdated="January 2025"
    />
  )
}

export default Shipping
