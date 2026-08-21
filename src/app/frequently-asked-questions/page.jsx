import React from 'react'
import QuestionsClient from './QuestionsClient'

export const metadata = {
  title: "Frequently Asked Questions | DC Wine & Spirits",
  description:
    "Frequently Asked Questions - Have questions about shipping, orders, customization, or our products? Find answers here.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/frequently-asked-questions/",
  },
};

const page = () => {
  return (
    <>
      <QuestionsClient/>
    </>
  )
}

export default page
