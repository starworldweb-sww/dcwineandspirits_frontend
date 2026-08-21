import React from 'react'
import OrderClient from './OrderClient'



export const metadata = {
  title: "Order History | DC Wine & Spirits",
  description:
    "Shop at DC Wine & Spirits wide selection of wine and champagne gifts. Visit our online store for fast delivery, great prices & best customer service in USA.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/account/order/",
  },
};

const page = () => {
  return (
    <>
     <OrderClient /> 
    </>
  )
}

export default page
