import React from 'react'
import CompareClient from './CompareClient'


export const metadata = {
  title: "Compare Products | DC Wine & Spirits",
  robots: {
    index: false,
    follow: true,
  },
  description:
    "Compare wines, champagne, and spirits at DC Wine & Spirits. Review product details, prices, and features side by side to find the right bottle for you.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/compare/",
  },
};

const page = () => {
  return (
    <>
      <CompareClient />
    </>
  )
}

export default page
