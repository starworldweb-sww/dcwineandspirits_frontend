import React from 'react'
import LoginClient from './LoginClient'


export const metadata = {
  title: "Account Login | DC Wine & Spirits",
  description: "Shop at DC Wine & Spirits wide selection of wine and champagne gifts. Visit our online store for fast delivery, great prices & best customer service in USA.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/account/login/",
  },
};

const page = () => {
  return (
    <>
      <LoginClient/>
    </>
  )
}

export default page
