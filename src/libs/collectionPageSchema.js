export const generateCollectionPageSchema = (
  products,
  categoryName,
  description,
  slug,
  totalProducts,
  priceRange,
  baseUrl = "https://www.wineandchampagnegifts.com",
  imageBaseUrl = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL,
) => {
  const hasProducts = Array.isArray(products) && products.length > 0;
  const pageUrl = `${baseUrl}/${slug}/`;

  const itemListElement = hasProducts
    ? products.map((product, index) => {
        const productSlug = product.slug ?? product.id ?? product.product_id;
        return {
          "@type": "ListItem",
          position: index + 1,
          url: `${baseUrl}/${productSlug}/`,
          name: product.name,
        };
      })
    : [];

  const pageImage =
    hasProducts && products[0]?.image
      ? `${imageBaseUrl}${products[0].image}`
      : null;

  const numberOfItems =
    typeof totalProducts === "number" ? totalProducts : itemListElement.length;

  const hasPriceRange =
    priceRange &&
    typeof priceRange.min === "number" &&
    typeof priceRange.max === "number";

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: categoryName || slug,
    url: pageUrl,
    ...(description && { description }),
    ...(pageImage && {
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: pageImage,
      },
      image: {
        "@type": "ImageObject",
        url: pageImage,
      },
    }),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      offerCount: numberOfItems,
      ...(hasPriceRange && {
        lowPrice: priceRange.min,
        highPrice: priceRange.max,
      }),
    },
    mainEntity: {
      "@type": "ItemList",
      url: pageUrl,
      name: categoryName || slug,
      numberOfItems,
      itemListElement,
    },
  };
};