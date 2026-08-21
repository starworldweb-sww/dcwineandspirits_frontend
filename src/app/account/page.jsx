import React from 'react'
import AccountClient from './AccountClient'



export const metadata = {
  title: "My Account | DC Wine & Spirits",
  description:
    "Shop at DC Wine & Spirits wide selection of wine and champagne gifts. Visit our online store for fast delivery, great prices & best customer service in USA.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/account/",
  },
};

const page = () => {
  return (
    <>
      <AccountClient />
    </>
  )
}

export default page
