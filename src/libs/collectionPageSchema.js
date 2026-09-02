export const generateCollectionPageSchema = (
  products,
  categoryName,
  description,
  slug,
  totalProducts,
  priceRange,
  baseUrl = "https://www.dcwineandspirits.com",
  imageBaseUrl = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL,
) => {
  const hasProducts = Array.isArray(products) && products.length > 0;
  const pageUrl = `${baseUrl}/${slug}/`;

  const itemListElement = hasProducts
    ? products.map((product, index) => {
        const productSlug =
          product.seo_url ?? product.slug ?? product.id ?? product.product_id;
        const productUrl = `${baseUrl}/${productSlug}/`;
        // Build full Product object
        const productItem = {
          "@type": "Product",
          name: product.name,
          url: productUrl,
        };
        // Add image if available
        if (product.image) {
          productItem.image = `${imageBaseUrl}${product.image}`;
        }
        // Add price if available
        if (product.final_price) {
          productItem.offers = {
            "@type": "Offer",
            price: product.final_price,
            priceCurrency: "USD",
            availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          };
        }
        return {
          "@type": "ListItem",
          position: index + 1,
          item: productItem,
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

  const cleanDescription = description
    ? description.replace(/<[^>]*>/g, "").trim()
    : null;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    name: categoryName || slug,
    url: pageUrl,
    ...(cleanDescription && { description: cleanDescription }),
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
      // Added shipping details
      shippingDetails: {
        "@type": "OfferShippingDetails",
        description: "Fast Delivery: $99 to $599 · $20 delivery",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 20,
          currency: "USD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
      },
      // Added return policy
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 90,
      },
    },
    mainEntity: {
      "@type": "ItemList",
      url: pageUrl,
      name: categoryName || slug,
      numberOfItems,
      itemListElement,
    },
    // Added promotion as additionalProperty
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Promotion",
        value: "$10 off on order of $100",
      },
    ],
  };
};