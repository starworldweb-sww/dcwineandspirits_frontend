export const generateWebsiteSchema = (
  baseUrl = "https://www.dcwineandspirits.com",
) => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: `${baseUrl}/`,
        name: "DC Wine & Spirits",
        alternateName: ["DC Wine and Spirits", "DCWineandSpirits.com"],
        inLanguage: "en-US",
        publisher: {
          "@id": `${baseUrl}/#store`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/products-dynamic/?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
};