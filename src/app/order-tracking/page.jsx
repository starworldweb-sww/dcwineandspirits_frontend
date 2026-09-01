import React from 'react'
import TrackClient from './TrackClient'


export const metadata = {
  title: "Order Tracking | DC Wine & Spirits",
  description:
    "Track your wine and spirits order status and delivery updates in real time. Enter your order number and email for quick access.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/order-tracking/",
  },
};

const page = () => {
  return (
    <>
      <TrackClient/>
    </>
  )
}

export default page
