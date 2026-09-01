import React from 'react'
import PrivacyClient from './PrivacyClient'




export const metadata = {
  title: "Privacy Policy | DC Wine & Spirits",
  description:
    "Dcwineandspirits.com respects each individual user's right to privacy. We take decent precautions to keep the personal information disclosed to us secure.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/privacy/",
  },
};

const page = () => {
  return (
    <>
      <PrivacyClient/>
    </>
  )
}

export default page
