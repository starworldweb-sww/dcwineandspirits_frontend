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

const now = new Date().toISOString();

export async function GET() {
  const [blogCategories, blogs] = await Promise.all([
    fetchFromBackend("/sitemap/blog-categories"),
    fetchFromBackend("/sitemap/blogs"),
  ]);

  const bc = Array.isArray(blogCategories) ? blogCategories : [];
  const bl = Array.isArray(blogs) ? blogs : [];

  const entries = [];

  for (const cat of bc) {
    if (!cat || !cat.slug) continue;
    entries.push(
      buildUrlEntry({
        loc: buildUrl(`/blogs/${cat.slug}`),
        lastmod: now,
        changefreq: "weekly",
        priority: 0.7,
      })
    );
  }

  for (const blog of bl) {
    if (!blog || !blog.slug) continue;
    entries.push(
      buildUrlEntry({
        loc: buildUrl(`/blogs/${blog.slug}`),
        lastmod: toISODate(blog.date_modified || blog.date_added),
        changefreq: "monthly",
        priority: 0.6,
      })
    );
  }

  const xmlBody = entries.length ? entries.join("\n") : "";
  const xml = `${XML_URLSET_HEADER}\n${xmlBody}\n${XML_URLSET_FOOTER}`;
  return xmlResponse(xml);
}
