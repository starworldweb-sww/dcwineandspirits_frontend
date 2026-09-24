export const generateOnlineStoreSchema = (
  baseUrl = "https://www.dcwineandspirits.com",
) => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OnlineStore",
        "@id": `${baseUrl}/#store`,
        name: "DC Wine & Spirits",
        legalName: "DC Wine & Spirits",
        alternateName: ["DC Wine and Spirits", "DCWineandSpirits.com"],
        url: `${baseUrl}/`,
        description:
          "Family-owned online gift store based in Washington, DC, selling 100% authentic wine, champagne and spirits sourced from authorized distributors, plus curated gift baskets. Delivery to adults 21+ across the United States, with same-day and next-day delivery available in selected areas.",
        slogan: "Build Your Relationships",
        foundingDate: "2014",
        logo: {
          "@type": "ImageObject",
          "@id": `${baseUrl}/#logo`,
          url: `${baseUrl}/image/catalog/logo/dcwineandspirits-logo-1200x630.jpg`,
          width: 1200,
          height: 630,
        },
        brand: {
          "@type": "Brand",
          name: "DC Wine & Spirits",
          logo: `${baseUrl}/image/catalog/logo/dcwineandspirits-logo-1200x630.jpg`,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Washington",
          addressRegion: "DC",
          postalCode: "20008",
          addressCountry: "US",
        },
        areaServed: {
          "@type": "Country",
          name: "United States",
        },
        knowsAbout: [
          "Wine gift baskets",
          "Champagne gift baskets",
          "Wine delivery",
          "Champagne delivery",
          "Personalized wine and champagne bottles",
          "Corporate wine gifts",
        ],
        sameAs: [
          "https://www.facebook.com/dcwineandspirits.official/",
          "https://www.instagram.com/dcwineandspirits/",
          "https://www.linkedin.com/company/dc-wine-spirits/",
          "https://www.pinterest.com/dcwinenspirit/",
          "https://www.youtube.com/@dcwineandspirits",
          "https://www.trustpilot.com/review/dcwineandspirits.com",
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: "+1-202-459-8489",
            email: "contact@dcwineandspirits.com",
            availableLanguage: "en",
            description:
              "Phone and email support, Monday to Friday, 10:00 AM to 5:00 PM Eastern Time.",
            hoursAvailable: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
              ],
              opens: "10:00",
              closes: "17:00",
            },
          },
          {
            "@type": "ContactPoint",
            contactType: "sales",
            email: "contact@dcwineandspirits.com",
            availableLanguage: "en",
            description: "Online orders are accepted 24 hours a day, 7 days a week.",
            hoursAvailable: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              opens: "00:00",
              closes: "23:59",
            },
          },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          "@id": `${baseUrl}/#catalog`,
          name: "DC Wine & Spirits Gift Collections",
          itemListElement: [
            {
              "@type": "OfferCatalog",
              name: "Wine Gift Baskets",
              url: `${baseUrl}/wine-gift-baskets/`,
            },
            {
              "@type": "OfferCatalog",
              name: "Champagne Gift Baskets",
              url: `${baseUrl}/champagne-gift-baskets/`,
            },
            {
              "@type": "OfferCatalog",
              name: "Prosecco Gifts",
              url: `${baseUrl}/prosecco-gift-basket/`,
            },
            {
              "@type": "OfferCatalog",
              name: "Personalized & Engraved Bottles",
              url: `${baseUrl}/personalized-wine-and-champagne-bottles/`,
            },
            {
              "@type": "OfferCatalog",
              name: "Corporate Wine Gifts",
              url: `${baseUrl}/corporate-gift-basket/`,
            },
          ],
        },
        makesOffer: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Same-day and next-day delivery in selected areas",
              description:
                "Same-day and next-day delivery is available for selected items in selected areas. Check the delivery options at checkout or contact us to confirm availability for your address.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Personalized, engraved and hand-painted bottles",
              description:
                "Personalized labels, custom messages, engraving and hand-painted wine and champagne bottles.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Custom gift baskets",
              description: "Pair any gift basket with any wine or champagne from the store.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Corporate and bulk gifting",
              description:
                "Client, employee and event gifts with company logos, branded packaging, custom labels and bulk pricing, usually from 10 units.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Multi-recipient delivery",
              description:
                "Send gifts to several addresses in a single order, with tracking for each shipment.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Free gift message card",
              description:
                "A free greeting card with your message is included with every gift.",
            },
          },
        ],
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          "@id": `${baseUrl}/#returnpolicy`,
          merchantReturnLink: `${baseUrl}/return-policy/`,
          applicableCountry: "US",
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 90,
          itemCondition: "https://schema.org/NewCondition",
          returnMethod: "https://schema.org/ReturnByMail",
          returnFees: "https://schema.org/FreeReturn",
        },
      },
    ],
  };
};