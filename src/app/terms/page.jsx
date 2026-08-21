import React from 'react'
import TermsClient from './TermsClient'



export const metadata = {
  title: "Terms & Conditions - DC Wine & Spirits",
  description:
    "We are online wine gift store in USA, Read our Terms & Conditions at DC Wine & Spirits web portal.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/terms/",
  },
};

const page = () => {
  return (
    <>
      <TermsClient/>
    </>
  )
}

export default page
