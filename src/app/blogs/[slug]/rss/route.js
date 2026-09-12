import { blogService } from "@/app/api/services/blogService";

const SITE_URL = "https://www.dcwineandspirits.com";
const BLOGS_URL = `${SITE_URL}/blogs/`;
const CATEGORY_DOMAIN = BLOGS_URL;

function formatRFC2822(dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(date.getTime())) {
    const now = new Date();
    return now.toUTCString();
  }
  return date.toUTCString();
}

function xmlEscape(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdataWrap(str) {
  if (str == null) return "";
  const cleaned = String(str).replace(/\]\]>/g, "]]]]><![CDATA[>");
  return `<![CDATA[${cleaned}]]>`;
}

function getBlogImageUrl(imagePath) {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const IMAGE_BASE = "https://www.dcwineandspirits.com/image/";
  const cleanBase = IMAGE_BASE.replace(/\/$/, "");
  const cleanPath = imagePath.replace(/^\//, "");
  return `${cleanBase}/${cleanPath}`;
}

function getExcerpt(html, maxLength = 280) {
  if (!html) return "";
  const plainText = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).trim() + "…";
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchCategoryPosts(categorySlug, categoryId) {
  const allPosts = [];
  let currentPage = 1;
  const limit = 100;

  while (true) {
    try {
      const result = await blogService.getAllPosts({
        page: currentPage,
        limit,
        categorySlug,
        categoryId,
      });
      const posts = result?.posts ?? [];
      const pagination = result?.pagination ?? { totalPages: 1 };
      const totalPages = pagination.totalPages ?? 1;

      if (Array.isArray(posts)) {
        allPosts.push(...posts);
      }

      if (currentPage >= totalPages || posts.length === 0) {
        break;
      }
      currentPage += 1;
    } catch (err) {
      console.error("[RSS Category] fetchCategoryPosts error on page", currentPage, err);
      break;
    }
  }

  return allPosts;
}

async function findCategoryBySlug(slug) {
  try {
    const allCategories = await blogService.getAllCategory();
    if (Array.isArray(allCategories)) {
      const match = allCategories.find(
        (c) => c.slug === slug || String(c.category_id) === String(slug),
      );
      return { category: match || null, allCategories };
    }
    return { category: null, allCategories: [] };
  } catch (err) {
    console.error("[RSS Category] findCategoryBySlug error", err);
    return { category: null, allCategories: [] };
  }
}

function buildCategoriesForPost(post, allCategories) {
  const raw =
    post.categories ||
    post.category_names ||
    post.category ||
    (post.category_id ? [post.category_id] : []);

  if (Array.isArray(raw) && raw.length > 0) {
    const firstItem = raw[0];
    if (typeof firstItem === "string") {
      return raw;
    }
    if (firstItem && typeof firstItem === "object") {
      return raw
        .map((c) => c.name || c.title || "")
        .filter(Boolean);
    }
  }

  if (typeof raw === "string" && raw) {
    return [raw];
  }

  if (post.category_id && allCategories.length > 0) {
    const matched = allCategories.find((c) => c.category_id === post.category_id);
    if (matched?.name) return [matched.name];
  }

  return [];
}

export async function GET(_request, { params }) {
  const { slug } = await params;

  const { category, allCategories } = await findCategoryBySlug(slug);

  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const buildDate = formatRFC2822(now);
  const contact = "contact@dcwineandspirits.com (DC Wine &amp; Spirits)";
  const categoryUrl = `${SITE_URL}/blogs/${slug}/`;
  const feedUrl = `${categoryUrl}rss/`;

  let posts = [];
  let channelTitle = "DC Wine &amp; Spirits Blog";
  let channelDescription =
    "Wine gifting guides, champagne gift ideas, wine education, special occasions, corporate gifting and more from DC Wine &amp; Spirits.";

  if (category) {
    posts = await fetchCategoryPosts(slug, category.category_id);
    channelTitle = `${xmlEscape(category.name)} | DC Wine &amp; Spirits Blog Category`;
    const catDesc = stripHtml(category.description);
    if (catDesc) {
      channelDescription = catDesc;
    }
  } else {
    let currentPage = 1;
    const limit = 100;
    while (true) {
      try {
        const result = await blogService.getAllPosts({ page: currentPage, limit });
        const pagePosts = result?.posts ?? [];
        const pagination = result?.pagination ?? { totalPages: 1 };
        const totalPages = pagination.totalPages ?? 1;
        if (Array.isArray(pagePosts)) posts.push(...pagePosts);
        if (currentPage >= totalPages || pagePosts.length === 0) break;
        currentPage += 1;
      } catch (err) {
        console.error("[RSS Category] fallback fetch error", err);
        break;
      }
    }
  }

  const sortedPosts = [...posts].sort((a, b) => {
    const dA = new Date(a.date_created || 0).getTime();
    const dB = new Date(b.date_created || 0).getTime();
    return dB - dA;
  });

  const newestPostDate = sortedPosts[0]?.date_created || buildDate;
  const pubDate = formatRFC2822(newestPostDate);
  const copyright = `Copyright ${currentYear} DC Wine &amp; Spirits`;

  const itemsXml = sortedPosts
    .map((post) => {
      const postUrl = `${SITE_URL}/blogs/${post.slug}/`;
      const authorName = [post.author_firstname, post.author_lastname]
        .filter(Boolean)
        .join(" ") || "DC Wine &amp; Spirits";

      const descriptionSource = post.meta_description || post.description || "";
      const descriptionText = descriptionSource.startsWith("<")
        ? getExcerpt(descriptionSource)
        : stripHtml(descriptionSource) || post.title;

      const contentHtml = post.content || post.description || "";
      const imageUrl = getBlogImageUrl(post.image);
      const imageType = /\.png$/i.test(post.image || "")
        ? "image/png"
        : /\.webp$/i.test(post.image || "")
          ? "image/webp"
          : "image/jpeg";

      const categories = buildCategoriesForPost(post, allCategories);
      const categoriesXml = categories
        .map(
          (catName) =>
            `    <category domain="${xmlEscape(CATEGORY_DOMAIN)}">${xmlEscape(
              catName.trim(),
            )}</category>`,
        )
        .join("\n");

      const mediaXml = imageUrl
        ? [
            `    <media:content`,
            `      url="${xmlEscape(imageUrl)}"`,
            `      medium="image"`,
            `      type="${imageType}" />`,
            ``,
            `    <media:title type="plain">${xmlEscape(post.title)}</media:title>`,
            descriptionText
              ? `    <media:description type="plain">${xmlEscape(descriptionText)}</media:description>`
              : "",
          ]
            .filter(Boolean)
            .join("\n")
        : "";

      return [
        `  <item>`,
        `    <title>${xmlEscape(post.title)}</title>`,
        `    <link>${xmlEscape(postUrl)}</link>`,
        ``,
        `    <guid isPermaLink="true">${xmlEscape(postUrl)}</guid>`,
        ``,
        `    <description>${cdataWrap(descriptionText)}</description>`,
        ``,
        `    <content:encoded>${cdataWrap(contentHtml)}</content:encoded>`,
        ``,
        `    <pubDate>${formatRFC2822(post.date_created)}</pubDate>`,
        `    <dc:creator>${xmlEscape(authorName)}</dc:creator>`,
        ``,
        categoriesXml || `    <category domain="${xmlEscape(CATEGORY_DOMAIN)}">Wine &amp; Spirits</category>`,
        mediaXml ? `` : "",
        mediaXml,
        `  </item>`,
      ]
        .filter((line) => line !== false)
        .join("\n");
    })
    .join("\n\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:media="http://search.yahoo.com/mrss/">

  <channel>
    <title>${channelTitle}</title>
    <link>${category ? categoryUrl : BLOGS_URL}</link>
    <description>${category ? xmlEscape(channelDescription) : channelDescription}</description>
    <language>en-us</language>
    <copyright>${copyright}</copyright>
    <managingEditor>${contact}</managingEditor>
    <webMaster>${contact}</webMaster>
    <pubDate>${pubDate}</pubDate>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <ttl>60</ttl>

    <atom:link href="${feedUrl}"
               rel="self"
               type="application/rss+xml" />

${itemsXml}

  </channel>
</rss>`;

  return new Response(rssXml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
