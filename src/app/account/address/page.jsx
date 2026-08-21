import React from 'react'
import AddressClient from './AddressClient'




export const metadata = {
  title: "Address Book",
  description:
    "Shop at DC Wine & Spirits wide selection of wine and champagne gifts. Visit our online store for fast delivery, great prices & best customer service in USA.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/account/address/",
  },
};

const page = () => {
  return (
    <div>
      <AddressClient/>
    </div>
  )
}

export default page
