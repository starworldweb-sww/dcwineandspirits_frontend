import React, { Suspense } from 'react'
import LoginClient from './LoginClient'


export const metadata = {
  title: "Account Login | DC Wine & Spirits",
  robots: {
    index: false,
    follow: true,
  },
  description: "Shop at DC Wine & Spirits wide selection of wine and champagne gifts. Visit our online store for fast delivery, great prices & best customer service in USA.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/account/login/",
  },
};

const page = () => {
  return (
    <>
      <Suspense fallback={null}>
        <LoginClient/>
      </Suspense>
    </>
  )
}

export default page