import React from 'react'
import OrderConfirmation from './thank-you';

export const metadata = {
  title: "Your Order Has Been Placed. Thank You!",
  description:
    "Your order has been placed successfully. We've sent a confirmation email with your order details, and you'll receive shipping updates soon.",
};

const page = () => {
  return (
    <div>
      <OrderConfirmation/>
    </div>
  )
}

export default page