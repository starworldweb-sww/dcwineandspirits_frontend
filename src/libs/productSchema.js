export function buildProductSchema(product) {
  const IMAGE_BASE = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL ?? "";

  const decodeAndStrip = (str) => {
    if (!str) return "";
    return str
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const hasReviews =
    Number(product.review_count) > 0 && product.reviews?.length > 0;

  // special_price agar set hai to wahi effective price hai, warna price
  const effectivePrice = product.special_price ?? product.price;
  const hasDiscount =
    product.special_price != null &&
    Number(product.special_price) < Number(product.price);

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: `${IMAGE_BASE}${product.image}`,
    description: decodeAndStrip(product.description),
    sku: product.sku || String(product.product.model || product.product_id),
    mpn: product.mpn || String(product.product.model || product.product_id),
    model: product.model || String(product.product_id),
    brand: {
      "@type": "Brand",
      name: "DC Wine & Spirits",
    },
    manufacturer: {
      "@type": "Organization",
      name: product.manufacturer?.name,
    },
    offers: {
      "@type": "Offer",
      url: `https://www.dcwineandspirits.com/${product.seo_url}/`,
      priceCurrency: "USD",
      price: effectivePrice,
      ValidFrom: "2024-01-01",
      priceValidUntil: "2027-07-07",
      itemCondition: "https://schema.org/NewCondition",
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "DC Wine & Spirits",
      },
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceCurrency: "USD",
        price: effectivePrice,
        ...(hasDiscount && {
          referencePrice: {
            "@type": "UnitPriceSpecification",
            priceCurrency: "USD",
            price: product.price,
            priceType: "https://schema.org/ListPrice",
          },
        }),
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          minValue: "0",
          maxValue: "30",
          currency: "USD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          businessDays: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "https://schema.org/Monday",
              "https://schema.org/Tuesday",
              "https://schema.org/Wednesday",
              "https://schema.org/Thursday",
              "https://schema.org/Friday",
            ],
          },
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 10,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
        url: "https://www.dcwineandspirits.com/shipping-and-delivery-policy/",
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnLink:
          "https://www.dcwineandspirits.com/return-policy/",
        merchantReturnDays: 90,
        returnFees: "https://schema.org/FreeReturn",
        returnMethod: "https://schema.org/ReturnByMail",
      },
    },
    ...(product.related_products?.length && {
      isRelatedTo: product.related_products.map((p) => ({
        "@type": "Product",
        name: p.name,
        url: `https://www.dcwineandspirits.com/${p.seo_url}/`,
        image: p.image ? `${IMAGE_BASE}${p.image}` : undefined,
      })),
    }),
    ...(hasReviews && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.average_rating,
        reviewCount: product.review_count,
      },
      review: product.reviews.map((r) => ({
        "@type": "Review",
        name: product.name,
        author: { "@type": "Person", name: r.author },
        datePublished: r.date_added,
        reviewBody: r.text,
        reviewRating: { "@type": "Rating", ratingValue: r.rating },
      })),
    }),
  };
} 