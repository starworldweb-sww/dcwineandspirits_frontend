export const generateBreadcrumbSchema = (
  breadcrumbs = [],
  slug = "",
  baseUrl = "https://www.dcwineandspirits.com",
  name = null
) => {
  const cleanBase = baseUrl.replace(/\/+$/, "");

  // 🔹 Raw lowercase slug ko Title Case Name me convert karega (e.g. 'red-wine' -> 'Red Wine')
  const formatTitle = (str) => {
    if (!str) return "Product";
    return str
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // 🔹 URL (@id) hamesha lowercase aur clean rahega
  const buildUrl = (path) => {
    if (!path) return `${cleanBase}/`;
    const cleanPath = String(path).toLowerCase().replace(/^\/+|\/+$/g, "");
    return cleanPath ? `${cleanBase}/${cleanPath}/` : `${cleanBase}/`;
  };

  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@id": buildUrl(""),
        name: "Home",
      },
    },
  ];

  const hasBreadcrumbs = Array.isArray(breadcrumbs) && breadcrumbs.length > 0;
  const cleanSlug = slug ? String(slug).toLowerCase().replace(/^\/+|\/+$/g, "") : "";
  
  // 🔹 'name' me casing sahi rahegi jabki '@id' URL lowercase rahega
  const currentPageName = name ? String(name).trim() : formatTitle(cleanSlug);

  if (hasBreadcrumbs) {
    breadcrumbs.forEach((crumb) => {
      const crumbSlug = crumb?.slug ? String(crumb.slug).toLowerCase().replace(/^\/+|\/+$/g, "") : "";
      if (crumbSlug) {
        itemListElement.push({
          "@type": "ListItem",
          position: itemListElement.length + 1,
          item: {
            "@id": buildUrl(crumbSlug),
            name: crumb?.name ? String(crumb.name).trim() : formatTitle(crumbSlug),
          },
        });
      }
    });

    const lastItemUrl = itemListElement[itemListElement.length - 1]?.item?.["@id"];
    const currentPageUrl = buildUrl(cleanSlug);

    if (cleanSlug && lastItemUrl !== currentPageUrl) {
      itemListElement.push({
        "@type": "ListItem",
        position: itemListElement.length + 1,
        item: {
          "@id": currentPageUrl,
          name: currentPageName,
        },
      });
    }
  } else if (cleanSlug) {
    // 🔹 Fallback: Agar breadcrumbs array missing ho, toh direct Home -> Product/Slug utha lega
    itemListElement.push({
      "@type": "ListItem",
      position: 2,
      item: {
        "@id": buildUrl(cleanSlug),
        name: currentPageName,
      },
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
};