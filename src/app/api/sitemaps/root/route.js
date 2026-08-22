export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  BASE_URL,
  addTrailingSlash,
  buildSitemapIndexEntry,
  XML_SITEMAPINDEX_HEADER,
  XML_SITEMAPINDEX_FOOTER,
  xmlResponse,
} from "../../../sitemap-helper.js";

const SITEMAP_FILES = [
  "sitemap-pages.xml",
  "sitemap-categories.xml",
  "sitemap-products.xml",
  "sitemap-brands.xml",
  "sitemap-blogs.xml",
  "sitemap-information.xml",
];

const now = new Date().toISOString();

export async function GET() {
  const base = addTrailingSlash(BASE_URL);
  const entries = SITEMAP_FILES.map((fileName) =>
    buildSitemapIndexEntry({
      loc: `${base}${fileName}`,
      lastmod: now,
    })
  ).join("\n");

  const xml = `${XML_SITEMAPINDEX_HEADER}\n${entries}\n${XML_SITEMAPINDEX_FOOTER}`;
  return xmlResponse(xml);
}
