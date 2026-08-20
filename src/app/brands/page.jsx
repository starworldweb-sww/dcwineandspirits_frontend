import React from 'react'
import BrandsClient from './BrandsClient'



export const metadata = {
  title: "Find Your Favorite Wine & Champagne Brands | DC Wine & Spirits",
  description:
    "Browse our wide selection of wine and champagne brands available as gifts. Discover top-rated labels handpicked for quality, taste, and elegant presentation.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/brands",
  },
};

const page = () => {
  return (
    <>
      <BrandsClient/>
    </>
  )
}

export default page
