import React from 'react'
import RegisterClient from './RegisterClient'

export const metadata = {
  title: "Create Your Account | DC Wine & Spirits",
  robots: {
    index: false,
    follow: true,
  },
  description:
    "Create your DC Wine & Spirits account to shop our selection of wines, champagne, and spirits, manage your orders, and enjoy a faster, more convenient shopping experience.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/account/register/",
  },
};


const page = () => {
  return (
    <>
      <RegisterClient />
    </>
  )
}

export default page
