import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import RentalFeatures from '../components/RentalFeatures'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection/>
      <RentalFeatures/>
      <BestSeller/>
      <OurPolicy/>
      {/* <NewsletterBox/> */}
    </div>
  )
}

export default Home