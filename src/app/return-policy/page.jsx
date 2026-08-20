import React from 'react'
import ReturnPolicyClient from './Returnpolicyclient'



export const metadata = {
  title: "Return Policy | DC Wine & Spirits",
  description:
    "For any query regarding refund or return item, please contact us at (202) 459-8489 or contact@dcwineandspirits.com. We accept returns within 90 days of purchase.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/return-policy/",
  },
};

const page = () => {
  return (
    <>
     <ReturnPolicyClient/> 
    </>
  )
}

export default page
