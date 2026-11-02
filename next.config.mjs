/** @type {import('next').NextConfig} */

// Repo ka naam, bilkul wahi jo URL mein hai (case-sensitive)
const repoName = "Vlnexis-frontend";

// Sirf production build mein basePath lagao, taaki localhost pe normal chale
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  // Static HTML export banata hai (GitHub Pages sirf static files chalata hai)
  output: "export",

  // Site /Vlnexis-frontend/ ke andar chalti hai, isliye saare links/assets ke aage ye lagega
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",

  // Static export mein Next ka image optimizer nahi chalta
  images: { unoptimized: true },

  // /about ki jagah /about/index.html banata hai, GitHub Pages pe refresh par 404 nahi aata
  trailingSlash: true,
};

export default nextConfig; // agar file next.config.js hai aur CommonJS use karte ho: module.exports = nextConfig;