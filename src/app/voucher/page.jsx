import React from 'react'
import GiftCertificateClient from './GiftCertificateClient'



export const metadata = {
  title: "Purchase a Gift Certificate | DC Wine & Spirits",
  description:
    "Send a personalized gift certificate from DC Wine & Spirits. Choose a theme, amount, and message – delivered via email after payment.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/voucher/",
  }}

const page = () => {
  return (
    <>
    <GiftCertificateClient/>
      
    </>
  )
}

export default page
