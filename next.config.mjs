/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  trailingSlash: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.dcwineandspirits.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;