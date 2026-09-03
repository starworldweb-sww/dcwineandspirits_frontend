import React from 'react'
import CartClient from './CartClient'


export const metadata = {
  title: "Shopping Cart | DC Wine & Spirits",
  robots: {
    index: false,
    follow: true,
  },
  description:
    "Review and manage items in your shopping cart at DC Wine & Spirits. Add premium wine, champagne & spirits gift baskets before checkout. Secure and fast checkout process.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/cart/",
  },
}
const page = () => {
  return (
    <>
      <CartClient />
    </>
  )
}

export default page
