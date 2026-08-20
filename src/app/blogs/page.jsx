import React from 'react'
import BlogsClient from './BlogsClient'




export const metadata = {
  title: "Wine & Spirits Blogs | Expert Advice, Pairing Tips & Gift Ideas",
  description:
    "Discover expert wine and spirits advice, food pairing tips, and creative celebration ideas on the DC Wine and Spirits blog. Read our latest articles and guides.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/blogs/",
  },
};

const page = () => {
  return (
    <>
     <BlogsClient/> 
    </>
  )
}

export default page
