import React from 'react'
import PasswordClient from './PasswordClient'


export const metadata = {
  title: "Change Password | DC Wine & Spirits",
  description:
    "Shop at DC Wine & Spirits wide selection of wine and champagne gifts. Visit our online store for fast delivery, great prices & best customer service in USA.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/account/password",
  },
};



const page = () => {
  return (
    <>
      <PasswordClient/>
    </>
  )
}

export default page
