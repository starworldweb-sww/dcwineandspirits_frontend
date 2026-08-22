export const generateBreadcrumbSchema = (
  breadcrumbs,
  slug,
  baseUrl = "https://www.dcwineandspirits.com",
  name = null,
) => {
  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Thing",
        "@id": `${baseUrl}/`,
        name: "Home",
      },
    },
  ];

  const hasBreadcrumbs = Array.isArray(breadcrumbs) && breadcrumbs.length > 0;

  if (hasBreadcrumbs) {
    const lastCrumb = breadcrumbs[breadcrumbs.length - 1];
    const isLastCrumbCurrentPage = slug ? lastCrumb?.slug === slug : false;

    breadcrumbs.forEach((crumb) => {
      itemListElement.push({
        "@type": "ListItem",
        position: itemListElement.length + 1,
        item: {
          "@type": "Thing",
          "@id": `${baseUrl}/${crumb.slug}/`,
          name: crumb.name,
        },
      });
    });

    if (!isLastCrumbCurrentPage && slug) {
      itemListElement.push({
        "@type": "ListItem",
        position: itemListElement.length + 1,
        item: {
          "@type": "Thing",
          "@id": `${baseUrl}/${slug}/`,
          name: name || slug,
        },
      });
    }
  } else if (slug) {
    // Breadcrumbs nahi hain, seedha Home ke baad current page/slug utha lo
    itemListElement.push({
      "@type": "ListItem",
      position: itemListElement.length + 1,
      item: {
        "@type": "Thing",
        "@id": `${baseUrl}/${slug}/`,
        name: name || slug,
      },
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
};