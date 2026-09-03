// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// import {
//   buildUrl,
//   buildUrlEntry,
//   XML_URLSET_HEADER,
//   XML_URLSET_FOOTER,
//   xmlResponse,
//   fetchFromBackend,
//   STATIC_PAGES,
// } from "../../../sitemap-helper.js";

// const now = new Date().toISOString();

// export async function GET() {
//   const infoPages = (await fetchFromBackend("/sitemap/information")) || [];
//   const pages = [{ href: "/coupon-and-deals" },
//   { path: "/frequently-asked-questions" },
//   { path: "/about-us" },
//   { path: "/shipping-and-delivery-policy" },
//   { path: "/return-policy" },
//   { path: "/privacy" },

//   { path: "/terms" },
//   { path: "/contact" }];

//   const entries = [];
//   for (const page of pages) {
//     if (!page || !page.path) continue;
//     entries.push(
//       buildUrlEntry({
//         loc: buildUrl(`${page.path}`),
//         lastmod: now,
//         changefreq: "yearly",
//         priority: 0.5,
//       })
//     );
//   }
//   console.log("entries", entries)

//   const xmlBody = entries.length ? entries.join("\n") : "";
//   const xml = `${XML_URLSET_HEADER}\n${xmlBody}\n${XML_URLSET_FOOTER}`;
//   return xmlResponse(xml);
// }
