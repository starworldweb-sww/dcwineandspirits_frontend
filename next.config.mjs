/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  trailingSlash: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [

        {
        protocol: "https",
        hostname: "www.admin.dcwineandspirits.com",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "www.dcwineandspirits.com",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/sitemap.xml",
          destination: "/api/sitemaps/root",
        },
        {
          source: "/sitemap-pages.xml",
          destination: "/api/sitemaps/pages",
        },
        {
          source: "/sitemap-categories.xml",
          destination: "/api/sitemaps/categories",
        },
        {
          source: "/sitemap-products.xml",
          destination: "/api/sitemaps/products",
        },
        {
          source: "/sitemap-brands.xml",
          destination: "/api/sitemaps/brands",
        },
        {
          source: "/sitemap-blogs.xml",
          destination: "/api/sitemaps/blogs",
        },
        {
          source: "/sitemap-information.xml",
          destination: "/api/sitemaps/information",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;