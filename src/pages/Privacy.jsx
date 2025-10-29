import React from 'react'
import PolicyPage from '../components/PolicyPage'

const Privacy = () => {
  const content = (
    <div className=' text-[#3d2b1f]'>
      <p className='mb-6 text-[#3d2b1f] opacity-80'>
        At Vesper, we stand behind the quality of every garment we deliver. Our Warranty Policy ensures that you receive clean, well-maintained, and ready-to-wear pieces for every occasion.
      </p>

      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>1. Pristine Promise</h2>
      <ul className='list-disc pl-6 mb-4 text-[#3d2b1f] opacity-80'>
        <li>Every garment is professionally cleaned, sanitized, and quality-checked before delivery.</li>
        <li>If a garment arrives in unacceptable condition, you must notify Vesper within 24 hours for replacement or credit.</li>
      </ul>

      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>2. Damage Coverage</h2>
      <ul className='list-disc pl-6 mb-4 text-[#3d2b1f] opacity-80'>
        <li>Minor wear & tear (e.g., small stains, loose threads, missing buttons) is covered by Vesper.</li>
        <li>Major damage (tears, burns, dye transfer, irreparable stains) or loss of garment will incur a penalty up to the garment’s MRP.</li>
      </ul>

      <h2 className='text-xl font-semibold mb-4 mt-8 text-[#3d2b1f]'>3. Fit Guarantee</h2>
      <ul className='list-disc pl-6 mb-4 text-[#3d2b1f] opacity-80'>
        <li>If a garment does not fit, you may request an exchange within 24 hours of delivery (subject to availability).</li>
      </ul>
    </div>
  )

  return (
    <PolicyPage 
      title="Warranty Policy" 
      content={content}
      lastUpdated="September 2025"
    />
  )
}

export default Privacy
