import React from 'react'
import AuthorClient from './AuthorClient'

export const metadata = {
  title: "Blog Authors | DC Wine & Spirits",
  robots: {
    index: true,
    follow: true,
  },
  description: "Meet the expert authors behind DC Wine & Spirits blog. Discover insights on wine, champagne, spirits, tasting notes & buying guides from our team in USA.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/author/",
  },
  openGraph: {
    title: "Blog Authors | DC Wine & Spirits",
    description: "Meet the expert authors behind DC Wine & Spirits blog. Discover insights on wine, champagne, spirits, tasting notes & buying guides from our team in USA.",
    url: "https://www.dcwineandspirits.com/author/",
    siteName: "DC Wine & Spirits",
    images: [
      {
        url: "/authors/dcwineEditorial.png", 
        width: 1200,
        height: 630,
        alt: "DC Wine & Spirits Blog Authors",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Authors | DC Wine & Spirits",
    description: "Meet the expert authors behind DC Wine & Spirits blog.",
    images: ["/authors/dcwineEditorial.png"],
  },
};

const page = () => {
  return (
    <>
     <AuthorClient/> 
    </>
  )
}

export default page
