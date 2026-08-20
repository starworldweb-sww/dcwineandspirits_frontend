import React from 'react'
import AboutClient from './AboutClient'


export const metadata = {
  title: "About DC Wine & Spirits | Locally Owned Online Gift Store",
  description:
    "DC Wine & Spirits is your neighborhood online gift store. We are a locally owned and operated store that specializes in delivering generous presents for all occasions.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/about-us/",
  },
};

const page = () => {
  return (
    <>
    <AboutClient/>  
    </>
  )
}

export default page
