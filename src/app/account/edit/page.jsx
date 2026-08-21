import React from 'react'
import EditAccountClient from './EditAccountClient'



export const metadata = {
  title: "My Account Information | DC Wine & Spirits",
  description:
    "Shop at DC Wine & Spirits wide selection of wine and champagne gifts. Visit our online store for fast delivery, great prices & best customer service in USA.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/account/edit/",
  },
};

const page = () => {
  return (
    <>
      <EditAccountClient />
    </>
  )
}

export default page
