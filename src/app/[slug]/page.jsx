import { getMetaByType } from "@/libs/getMetaByType";
import { notFound } from "next/navigation";
import { decodeHtml } from "@/libs/decodeHtml";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/libs/get-query-client";
import { productKeys } from "@/libs/queryKeys";
import ProductsDynamicClient from "../products-dynamic/productsDynamicComponents/ProductsDynamicClient";
import ProductClient from "../product/productComponent/ProductClient";
import { productsService } from "../api/services/productsService";
import { cookies } from "next/headers";
import { buildProductSchema } from "@/libs/productSchema";
import { generateCollectionPageSchema } from "@/libs/collectionPageSchema";
import { generateBreadcrumbSchema } from "@/libs/breadCrumbSchema";
import Script from "next/script";
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const IMAGE_BASE_URL = "https://www.dcwineandspirits.com/image/";
  const FALLBACK_IMAGE =
    "https://www.dcwineandspirits.com/image/cache/catalog/logo/dcwineandspirits-logo-1200x630-600x315.webp";

  let meta = await getMetaByType("category", slug);
  let categoryData = null;

  if (meta) {
    try {
      // limit 1 — hume sirf category ki image chahiye, poori list nahi
      categoryData = await productsService.getProductBySlugOrId(slug, {}, 1, 1);

      console.log("Category data for og:", categoryData);
    } catch (e) {
      console.error("Category OG image fetch failed:", e.message);
    }
  }

  if (!meta) {
    meta = await getMetaByType("manufacturer", slug);
  }

  let productData = null;

  if (!meta) {
    meta = await getMetaByType("product", slug);
    if (meta) {
      try {
        productData = await productsService.getSingleProductDetails(slug);
        console.log("Product data for og:", productData);
      } catch (e) {
        console.error("Product OG image fetch failed:", e.message);
      }
    }
  }

  if (!meta) {
    notFound();
  }

  const rawImage = productData?.image || categoryData?.image || meta?.image;

  const ogImage = rawImage ? `${IMAGE_BASE_URL}${rawImage}` : FALLBACK_IMAGE;
  console.log("OG Image URL:", ogImage);

  return {
    title:
      decodeHtml(meta?.meta_title) ||
      decodeHtml(meta?.custom_title) ||
      "Products",
    description: decodeHtml(meta?.meta_description) || "",
    keywords: decodeHtml(meta?.meta_keyword) || "",
    alternates: {
      canonical: `https://www.dcwineandspirits.com/${slug}/`,
    },
    openGraph: {
      type: productMeta ? "product" : "website",
      url: `https://www.dcwineandspirits.com/${slug}/`,
      title: decodeHtml(meta?.meta_title) || decodeHtml(meta?.custom_title),
      description: decodeHtml(meta?.meta_description),
      siteName: "DC Wine & Spirits",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt:
            decodeHtml(meta?.meta_title) ||
            decodeHtml(meta?.custom_title) ||
            "DC Wine & Spirits",
        },
      ],
    },
    twitter: {
      site: "@dcwine_spirits",
      card: "summary_large_image",
      title: decodeHtml(meta?.meta_title) || decodeHtml(meta?.custom_title),
      description: decodeHtml(meta?.meta_description),
      images: [ogImage],
    },
    ...(productData && {
      other: {
        "product:price:amount":
          productData?.special_price || productData?.price,
        "product:price:currency": "USD",
        "product:availability": productData?.in_stock
          ? "in stock"
          : "out of stock",
      },
    }),
  };
}

export default async function ProductsSlugPage({ params }) {
  const { slug } = await params;
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const currentPage =
    Number(cookieStore.get(`current_page_${slug}`)?.value) || 1;
  let meta = await getMetaByType("category", slug);

  if (!meta) {
    meta = await getMetaByType("manufacturer", slug);
  }

  const productMeta = await getMetaByType("product", slug);

  if (!meta && !productMeta) {
    notFound();
  }

  if (productMeta) {
    let schema = null;
    let breadcrumbSchema = null;

    try {
      const product = await productsService.getSingleProductDetails(slug);

      console.log("Product single:", product);
      if (product) {
        schema = buildProductSchema(product);

        const breadcrumbsData =
          product.breadcrumbs && product.breadcrumbs.length > 1
            ? product.breadcrumbs
            : slug;

        breadcrumbSchema = generateBreadcrumbSchema(
          breadcrumbsData,
          product.slug,
          "https://www.dcwineandspirits.com",
          product.name,
        );
        console.log("Product schema:", schema);
      }
    } catch (e) {
      console.error("Schema fetch failed:", e.message);
    }

    await queryClient.prefetchQuery({
      queryKey: productKeys.singleProductDetail(slug),
      queryFn: () => productsService.getSingleProductDetails(slug),
    });

    return (
      <>
        {schema && (
          <Script
            id="product-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )}
        {breadcrumbSchema && (
          <Script
            id="product-breadcrumb-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbSchema),
            }}
          />
        )}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductClient slug={slug} />
        </HydrationBoundary>
      </>
    );
  }

  const pageParams = Array.from({ length: currentPage }, (_, i) => i + 1);
  const filter = {};
  const limit = 100;

  const queryKey = [...productKeys.bySlugOrId(slug), filter, limit];

  const pagesData = await Promise.all(
    pageParams.map((p) =>
      productsService.getProductBySlugOrId(slug, filter, p, limit),
    ),
  );

  queryClient.setQueryData(queryKey, {
    pages: pagesData,
    pageParams: pageParams,
  });

  let categoryCollectionSchema = null;
  let categoryBreadcrumbSchema = null;
  try {
    const firstPageData = pagesData[0];
    if (firstPageData) {
      categoryCollectionSchema = generateCollectionPageSchema(
        firstPageData.products?.items,
        decodeHtml(meta?.custom_title || meta?.meta_title) ||
          firstPageData.name,
        decodeHtml(meta?.meta_description) || firstPageData.smalldesc,
        slug,
        firstPageData.products?.total,
        firstPageData.priceRange,
      );

      const categoryBreadcrumbsData =
        firstPageData.breadcrumbs && firstPageData.breadcrumbs.length > 1
          ? firstPageData.breadcrumbs
          : slug;

      categoryBreadcrumbSchema = generateBreadcrumbSchema(
        categoryBreadcrumbsData,
        slug,
        "https://www.dcwineandspirits.com",
        decodeHtml(meta?.custom_title || meta?.meta_title) ||
          firstPageData.name,
      );
    }
  } catch (e) {
    console.error("Collection schema build failed:", e.message);
  }

  return (
    <>
      {categoryCollectionSchema && (
        <Script
          id="category-collection-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(categoryCollectionSchema),
          }}
        />
      )}
      {categoryBreadcrumbSchema && (
        <Script
          id="category-breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(categoryBreadcrumbSchema),
          }}
        />
      )}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductsDynamicClient slug={slug} />
      </HydrationBoundary>
    </>
  );
}
