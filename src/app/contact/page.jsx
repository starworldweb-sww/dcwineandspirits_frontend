import React from 'react'
import ContactClient from './ContactClient'

export const metadata = {
  title: "Contact Us | DC Wine & Spirits",
  description:
    "Get in touch with DC Wine & Spirits. Contact us for inquiries, bulk orders, or assistance. We offer premium wine, champagne & spirits gift baskets with fast delivery across USA.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/contact/",
  },}
const page = () => {
  return (
    <div>
      <ContactClient />
    </div>
  )
}

export default page
