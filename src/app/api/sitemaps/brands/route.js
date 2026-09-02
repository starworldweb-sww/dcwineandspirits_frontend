export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  buildUrl,
  buildUrlEntry,
  XML_URLSET_HEADER,
  XML_URLSET_FOOTER,
  xmlResponse,
  fetchFromBackend,
} from "../../../sitemap-helper.js";

const now = new Date().toISOString();

export async function GET() {
  const brands = (await fetchFromBackend("/sitemap/brands")) || [];

  const entries = [];
  for (const brand of brands) {
    if (!brand || !brand.slug) continue;
    entries.push(
      buildUrlEntry({
        loc: `${buildUrl("/")}${encodeURIComponent(brand.slug)}`,
        lastmod: now,
        changefreq: "monthly",
        priority: 0.6,
      })
    );
  }

  const xmlBody = entries.length ? entries.join("\n") : "";
  const xml = `${XML_URLSET_HEADER}\n${xmlBody}\n${XML_URLSET_FOOTER}`;
  return xmlResponse(xml);
}
