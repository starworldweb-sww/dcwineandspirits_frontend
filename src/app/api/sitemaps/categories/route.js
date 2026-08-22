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
  const data = await fetchFromBackend("/sitemap/categories");
  const categoriesFlat = (data && data.flat) || (Array.isArray(data) ? data : []);

  const entries = [];
  for (const cat of categoriesFlat) {
    if (!cat || !cat.slug) continue;
    entries.push(
      buildUrlEntry({
        loc: buildUrl(`/${cat.slug}`),
        lastmod: toISODate(cat.date_modified || cat.date_added),
        changefreq: "weekly",
        priority: cat.parent_id ? 0.7 : 0.8,
      })
    );
  }

  const xmlBody = entries.length ? entries.join("\n") : "";
  const xml = `${XML_URLSET_HEADER}\n${xmlBody}\n${XML_URLSET_FOOTER}`;
  return xmlResponse(xml);
}
