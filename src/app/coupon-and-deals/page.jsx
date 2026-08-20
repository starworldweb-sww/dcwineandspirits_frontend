import React from 'react'
import CouponsTable from './CouponsTable'


export const metadata = {
  title: "Coupon & Deals at DC Wine & Spirits | Save on Wine & Champagne Gifts",
  description:
    "Here is the list of best coupons and deals offered by DC Wine and Spirits. Sign up and save $10 today on your first order. Valid till 31st December 2026.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/coupon-and-deals/",
  },
};

const page = () => {
  return (
    <>
    <CouponsTable/>
      
    </>
  )
}

export default page
