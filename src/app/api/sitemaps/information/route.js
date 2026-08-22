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
  const infoPages = (await fetchFromBackend("/sitemap/information")) || [];

  const entries = [];
  for (const info of infoPages) {
    if (!info || !info.slug) continue;
    entries.push(
      buildUrlEntry({
        loc: buildUrl(`/${info.slug}`),
        lastmod: now,
        changefreq: "yearly",
        priority: 0.5,
      })
    );
  }

  const xmlBody = entries.length ? entries.join("\n") : "";
  const xml = `${XML_URLSET_HEADER}\n${xmlBody}\n${XML_URLSET_FOOTER}`;
  return xmlResponse(xml);
}
