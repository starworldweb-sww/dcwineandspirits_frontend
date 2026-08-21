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
    await queryClient.prefetchQuery({
      queryKey: productKeys.singleProductDetail(slug),
      queryFn: () => productsService.getSingleProductDetails(slug),
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductClient slug={slug} />
      </HydrationBoundary>
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
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsDynamicClient slug={slug} />
    </HydrationBoundary>
  );
}