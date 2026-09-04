import React from 'react'
import CheckoutPage from './CheckoutClient'


export const metadata = {
  title: "Checkout | DC Wine & Spirits",
  robots: {
    index: false,
    follow: true,
  },
  description:
    "Complete your order securely at DC Wine & Spirits. Review your items, enter your delivery details, and place your order for wines, champagne, and spirits.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/checkout/",
  },
};


const page = () => {
  return (
    <>
      <CheckoutPage />
    </>
  )
}

export default page
