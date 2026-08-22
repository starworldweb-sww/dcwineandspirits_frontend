import React from 'react'
import TestimonialClient from './TestimonialClient'



export const metadata = {
  title: "Testimonials | DC Wine & Spirits",
  description:
    "Read real customer reviews and testimonials for DC Wine & Spirits. See what our customers say about our wine and champagne gift baskets.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/index.php?route=extension/review/review_list",
  },
};

const page = () => {
  return (
    <>
    <TestimonialClient/>  
    </>
  )
}

export default page
