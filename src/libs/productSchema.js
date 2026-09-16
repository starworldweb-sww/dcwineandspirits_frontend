export function buildProductSchema(product) {
  const IMAGE_BASE = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL ?? "";

  // 🔹 Safe URL encoder (Spaces -> %20 & Double slashes prevention)
  const safeUrl = (path) => {
    if (!path) return "";
    const fullUrl = path.startsWith("http")
      ? path
      : `${IMAGE_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
    return encodeURI(fullUrl.trim());
  };

  // 🔹 HTML entities & tags stripper
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

  // 🔹 Image processing (Main + Additional gallery images)
  const mainImage = product?.image ? safeUrl(product.image) : null;
  const additionalImages = Array.isArray(product?.images)
    ? product.images
        .map((img) => {
          const imgPath = typeof img === "string" ? img : img?.image;
          return imgPath ? safeUrl(imgPath) : null;
        })
        .filter(Boolean)
    : [];

  const imageList = Array.from(
    new Set([mainImage, ...additionalImages].filter(Boolean))
  );

  // 🔹 Reviews & Rating safety checks
  const reviewCount = Number(product?.review_count ?? 0);
  const avgRating = Number(product?.average_rating ?? 0);
  const hasAggregateRating = reviewCount > 0 && avgRating > 0;
  const hasReviewList = Array.isArray(product?.reviews) && product.reviews.length > 0;

  const effectivePrice = product?.special_price ?? product?.price;
  const hasDiscount =
    product?.special_price != null &&
    Number(product?.special_price) < Number(product?.price);

  // 🔹 Exact Manufacturer/Brand determination
  const brandName = product?.manufacturer?.name || null;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product?.name || "",
    image: imageList.length > 1 ? imageList : imageList[0] || "",
    description: decodeAndStrip(product?.description),
    sku: product?.sku || String(product?.model || product?.product_id),
    model: product?.model || String(product?.product_id),

    ...(product?.mpn &&
      String(product.mpn).trim() !== "" && {
        mpn: String(product.mpn).trim(),
      }),

    ...(product?.upc &&
      String(product.upc).trim() !== "" && {
        gtin12: String(product.upc).trim(),
      }),

    ...(brandName && {
      brand: {
        "@type": "Brand",
        name: brandName,
      },
      manufacturer: {
        "@type": "Organization",
        name: brandName,
      },
    }),

    offers: {
      "@type": "Offer",
      url: `https://www.dcwineandspirits.com/${product?.seo_url || ""}/`,
      priceCurrency: "USD",
      price: String(effectivePrice),
      validFrom: "2024-01-01",
      priceValidUntil: "2027-07-07",
      itemCondition: "https://schema.org/NewCondition",
      availability: product?.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "DC Wine & Spirits",
      },
      priceSpecification: [
        {
          "@type": "UnitPriceSpecification",
          priceCurrency: "USD",
          price: String(effectivePrice),
        },
        ...(hasDiscount
          ? [
              {
                "@type": "UnitPriceSpecification",
                priceCurrency: "USD",
                price: String(product.price),
                priceType: "https://schema.org/ListPrice",
              },
            ]
          : []),
      ],
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          minValue: "0",
          maxValue: "50",
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
            maxValue: 7,
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

    // 🔹 Related Products mapping (Clean Lightweight Objects - No nested offers)
    ...(product?.related_products?.length && {
      isRelatedTo: product.related_products
        .filter((p) => p?.name && p?.seo_url)
        .map((p) => ({
          "@type": "Product",
          name: p.name,
          url: `https://www.dcwineandspirits.com/${p.seo_url}/`,
          ...(p.image && { image: safeUrl(p.image) }),
        })),
    }),

    // 🔹 Aggregate Rating
    ...(hasAggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: String(avgRating),
        reviewCount: String(reviewCount),
        bestRating: "5",
        worstRating: "1",
      },
    }),

    // 🔹 Reviews List
    ...(hasReviewList && {
      review: product.reviews.map((r) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: r.author || "Verified Buyer",
        },
        datePublished: r.date_added,
        reviewBody: decodeAndStrip(r.text),
        reviewRating: {
          "@type": "Rating",
          ratingValue: String(r.rating || 5),
          bestRating: "5",
          worstRating: "1",
        },
      })),
    }),
  };
}