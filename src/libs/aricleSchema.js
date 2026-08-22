export const generateArticleSchema = (blog) => ({
  "@context": "https://schema.org",
  "@type": "Article",

  headline: blog.title,

  description:

  
    blog.meta_description ||
    blog.content?.replace(/<[^>]*>/g, "").slice(0, 200),

  image: blog.image
    ? `https://www.dcwineandspirits.com/image/${blog.image}`
    : undefined,

  author: {
    "@type": "Person",
    name:
      [blog.author_firstname, blog.author_lastname].filter(Boolean).join(" ") ||
      "DC Wine & Spirits",
  },

  publisher: {
    "@type": "Organization",
    name: "DC Wine & Spirits",
    url: "https://www.dcwineandspirits.com/",
  },

  datePublished: blog.date_created
    ? new Date(blog.date_created).toISOString()
    : undefined,

  dateModified: blog.date_updated
    ? new Date(blog.date_updated).toISOString()
    : undefined,

  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `https://www.dcwineandspirits.com/blog/${blog.slug}/`,
  },
});