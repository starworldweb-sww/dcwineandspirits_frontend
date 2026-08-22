export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  buildUrl,
  buildUrlEntry,
  XML_URLSET_HEADER,
  XML_URLSET_FOOTER,
  xmlResponse,
  fetchFromBackend,
  toISODate,
} from "../../../sitemap-helper.js";

export async function GET() {
  const products = (await fetchFromBackend("/sitemap/products")) || [];

  const entries = [];
  for (const prod of products) {
    if (!prod || !prod.slug) continue;
    entries.push(
      buildUrlEntry({
        loc: buildUrl(`/${prod.slug}`),
        lastmod: toISODate(prod.date_modified || prod.date_added),
        changefreq: "weekly",
        priority: 0.7,
      })
    );
  }

  const xmlBody = entries.length ? entries.join("\n") : "";
  const xml = `${XML_URLSET_HEADER}\n${xmlBody}\n${XML_URLSET_FOOTER}`;
  return xmlResponse(xml);
}
