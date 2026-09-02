export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  buildUrl,
  buildUrlEntryWithImages,
  XML_URLSET_HEADER_WITH_IMAGE,
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

   
    const images = [];
    if (prod.image) {
      images.push({ loc: prod.image, title: prod.name });
    }
    if (Array.isArray(prod.gallery)) {
      for (const img of prod.gallery) {
        if (img) images.push({ loc: img, title: prod.name });
      }
    }

    entries.push(
      buildUrlEntryWithImages({
        loc: buildUrl(`/${prod.slug}`),
        lastmod: toISODate(prod.date_modified || prod.date_added),
        changefreq: "weekly",
        priority: 0.7,
        images,
      })
    );
  }

  const xmlBody = entries.length ? entries.join("\n") : "";
  const xml = `${XML_URLSET_HEADER_WITH_IMAGE}\n${xmlBody}\n${XML_URLSET_FOOTER}`;
  return xmlResponse(xml);
}