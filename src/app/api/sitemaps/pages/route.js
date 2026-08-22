export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  buildUrl,
  buildUrlEntry,
  XML_URLSET_HEADER,
  XML_URLSET_FOOTER,
  xmlResponse,
  STATIC_PAGES,
} from "../../../sitemap-helper.js";

const now = new Date().toISOString();

export async function GET() {
  const entries = STATIC_PAGES.map((p) =>
    buildUrlEntry({
      loc: buildUrl(p.path),
      lastmod: now,
      changefreq: p.changefreq,
      priority: p.priority,
    })
  ).join("\n");

  const xml = `${XML_URLSET_HEADER}\n${entries}\n${XML_URLSET_FOOTER}`;
  return xmlResponse(xml);
}
