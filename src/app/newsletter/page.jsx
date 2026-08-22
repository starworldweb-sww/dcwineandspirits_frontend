import React from 'react'
import NewsLetterClient from './NewsLetterClient'



export const metadata = {
  title: "Newsletter Subscription | DC Wine & Spirits",
  description:
    "Subscribe to our newsletter to stay up to date with news and promotions. Get a $10 discount on your first order.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/newsletter",
  },
};
const page = () => {
  return (
    <>

    <NewsLetterClient/>
      
    </>
  )
}

export default page
