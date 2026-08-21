import React from 'react'
import WishlistClient from './WishlistClient'






export const metadata = {
  title: "My Wish List",
  description:
    "Shop at DC Wine & Spirits wide selection of wine and champagne gifts. Visit our online store for fast delivery, great prices & best customer service in USA.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/wishlist/",
  },
};

const page = () => {
  return (
    <>
    <WishlistClient  />
    </>
  )
}

export default page
