export const dynamic = "force-dynamic";
export const revalidate = 0;

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_FRONTEND_URL ||
  "https://www.dcwineandspirits.com";

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api/v1";

export const XML_URLSET_HEADER = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

export const XML_URLSET_FOOTER = `</urlset>`;

export const XML_SITEMAPINDEX_HEADER = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

export const XML_SITEMAPINDEX_FOOTER = `</sitemapindex>`;

export const addTrailingSlash = (url) => {
  if (!url) return url;
  return url.endsWith("/") ? url : url + "/";
};

export const buildUrl = (path) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return addTrailingSlash(`${BASE_URL}${cleanPath}`);
};

export const toISODate = (dateInput) => {
  if (!dateInput) return new Date().toISOString();
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return new Date().toISOString();
    return d.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

export const escapeXml = (value) => {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

export const buildUrlEntry = ({ loc, lastmod, changefreq, priority }) => {
  const parts = [];
  parts.push(`  <url>`);
  parts.push(`    <loc>${escapeXml(loc)}</loc>`);
  if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
  if (changefreq) parts.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority != null) parts.push(`    <priority>${priority}</priority>`);
  parts.push(`  </url>`);
  return parts.join("\n");
};

export const buildSitemapIndexEntry = ({ loc, lastmod }) => {
  const parts = [];
  parts.push(`  <sitemap>`);
  parts.push(`    <loc>${escapeXml(loc)}</loc>`);
  if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
  parts.push(`  </sitemap>`);
  return parts.join("\n");
};

export const xmlResponse = (body) => {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
};

export const fetchFromBackend = async (endpoint) => {
  try {
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (err) {
    console.error(`sitemap-helper fetch error [${endpoint}]:`, err);
    return null;
  }
};

export const STATIC_PAGES = [
  { path: "/", changefreq: "daily", priority: 1.0 },
  { path: "/about-us", changefreq: "monthly", priority: 0.8 },
  { path: "/contact", changefreq: "monthly", priority: 0.8 },
  { path: "/brands", changefreq: "weekly", priority: 0.9 },
  { path: "/blogs", changefreq: "daily", priority: 0.9 },
  { path: "/search", changefreq: "monthly", priority: 0.5 },
  { path: "/account/login", changefreq: "yearly", priority: 0.3 },
  { path: "/register", changefreq: "yearly", priority: 0.3 },
  { path: "/frequently-asked-questions", changefreq: "monthly", priority: 0.7 },
  { path: "/shipping-and-delivery-policy", changefreq: "yearly", priority: 0.6 },
  { path: "/return-policy", changefreq: "yearly", priority: 0.6 },
  { path: "/terms", changefreq: "yearly", priority: 0.6 },
  { path: "/privacy-policy", changefreq: "yearly", priority: 0.6 },
  { path: "/coupon-and-deals", changefreq: "weekly", priority: 0.8 },
  { path: "/sitemap", changefreq: "monthly", priority: 0.3 },
  { path: "/checkout", changefreq: "monthly", priority: 0.4 },
  { path: "/account/cart", changefreq: "monthly", priority: 0.4 },
  { path: "/products", changefreq: "daily", priority: 0.8 },
];

export const SITEMAP_PATHS = [
  "sitemap-pages.xml",
  "sitemap-categories.xml",
  "sitemap-products.xml",
  "sitemap-brands.xml",
  "sitemap-blogs.xml",
  "sitemap-information.xml",
];
