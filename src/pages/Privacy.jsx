import React from 'react'
import PolicyPage from '../components/PolicyPage'

const Privacy = () => {
  const content = (
    <div>
      <p className='mb-6 text-gray-700'>
        At Vesper, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
      </p>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>1. Information We Collect</h2>
      <p className='mb-4 text-gray-700'>
        We collect information you provide directly to us, such as when you create an account, make a rental, or contact us for support. This may include:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>Name, email address, and phone number</li>
        <li>Billing and shipping addresses</li>
        <li>Payment information (processed securely through Razorpay)</li>
        <li>Rental history and preferences</li>
        <li>Communication preferences</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>2. How We Use Your Information</h2>
      <p className='mb-4 text-gray-700'>
        We use the information we collect to:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>Process and fulfill your rental orders</li>
        <li>Send you important updates about your rentals</li>
        <li>Improve our services and user experience</li>
        <li>Send you marketing communications (with your consent)</li>
        <li>Prevent fraud and ensure platform security</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>3. Information Sharing</h2>
      <p className='mb-4 text-gray-700'>
        We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>To process payments through Razorpay</li>
        <li>To fulfill rental orders and deliveries</li>
        <li>When required by law or to protect our rights</li>
        <li>With service providers who assist in our operations</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>4. Data Security</h2>
      <p className='mb-4 text-gray-700'>
        We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment information is encrypted and processed securely through Razorpay.
      </p>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>5. Cookies and Tracking</h2>
      <p className='mb-4 text-gray-700'>
        We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.
      </p>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>6. Your Rights</h2>
      <p className='mb-4 text-gray-700'>
        You have the right to:
      </p>
      <ul className='list-disc pl-6 mb-4 text-gray-700'>
        <li>Access and update your personal information</li>
        <li>Request deletion of your account and data</li>
        <li>Opt-out of marketing communications</li>
        <li>Request a copy of your data</li>
      </ul>
      
      <h2 className='text-xl font-semibold mb-4 mt-8'>7. Contact Us</h2>
      <p className='mb-4 text-gray-700'>
        If you have any questions about this Privacy Policy, please contact us at:
      </p>
      <p className='mb-2 text-gray-700'>Email: privacy@vesper.com</p>
      <p className='mb-2 text-gray-700'>Phone: +91-99999 99999</p>
      <p className='mb-4 text-gray-700'>Address: 123 Street A, Mumbai, India</p>
    </div>
  )

  return (
    <PolicyPage 
      title="Privacy Policy" 
      content={content}
      lastUpdated="January 2025"
    />
  )
}

export default Privacy
