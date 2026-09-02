import { getMetaByType } from "@/libs/getMetaByType";
import { notFound } from "next/navigation";
import { decodeHtml } from "@/libs/decodeHtml";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/libs/get-query-client";
import { productKeys } from "@/libs/queryKeys";
import ProductsDynamicClient from "../productsDynamic/productsDynamicComponents/ProductsDynamicClient";
import ProductClient from "../product/productComponent/ProductClient";
import { productsService } from "../api/services/productsService";
import { cookies } from "next/headers";
import { buildProductSchema } from "@/libs/productSchema";
import { generateCollectionPageSchema } from "@/libs/collectionPageSchema";
import { generateBreadcrumbSchema } from "@/libs/breadCrumbSchema";
import Script from "next/script";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  let meta = await getMetaByType("category", slug);

  if (!meta) {
    meta = await getMetaByType("manufacturer", slug);
   
  }

  if (!meta) {
    meta = await getMetaByType("product", slug);
  }

  if (!meta) {
    notFound();
  }

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
      title: decodeHtml(meta?.meta_title) || decodeHtml(meta?.custom_title),
      description: decodeHtml(meta?.meta_description),
    },
  };
}

export default async function ProductsSlugPage({ params }) {
  const { slug } = await params;
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const currentPage = Number(cookieStore.get(`current_page_${slug}`)?.value) || 1;
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
    if (product) {
      schema = buildProductSchema(product);
      breadcrumbSchema = generateBreadcrumbSchema(
        product.breadcrumbs,
        product.slug,
        "https://www.dcwineandspirits.com",
        product.name,
      );
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
  const limit = 24;

  const queryKey = [...productKeys.bySlugOrId(slug), filter, limit];

  const pagesData = await Promise.all(
    pageParams.map((p) => productsService.getProductBySlugOrId(slug, filter, p, limit))
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
        decodeHtml(meta?.meta_description) ||
        firstPageData.smalldesc,
        slug,
        firstPageData.products?.total,
        firstPageData.priceRange,
      );

      categoryBreadcrumbSchema = generateBreadcrumbSchema(
        firstPageData.breadcrumbs,
        slug,
        "https://www.dcwineandspirits.com",
        decodeHtml(meta?.custom_title || meta?.meta_title) || firstPageData.name,
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