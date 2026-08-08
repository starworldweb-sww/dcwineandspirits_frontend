import { getMetaByType } from "@/libs/getMetaByType";
import { notFound } from "next/navigation";
import { decodeHtml } from "@/libs/decodeHtml";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/libs/get-query-client";
import { productKeys } from "@/libs/queryKeys";
import ProductsDynamicClient from "../productsDynamic/productsDynamicComponents/ProductsDynamicClient";
import ProductClient from "../product/productComponent/ProductClient";

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
      canonical: `https://www.dcwineandspirits.com/${slug}`,
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

  let meta = await getMetaByType("category", slug);
  
  if (!meta) {
    meta = await getMetaByType("manufacturer", slug);
  }

  const productMeta = await getMetaByType("product", slug);
  

  if (!meta && !productMeta) {
    notFound();
  }

  if (productMeta) {
    // Prefetch product data server-side
    await queryClient.prefetchQuery({
      queryKey: productKeys.singleProductDetail(slug),
      queryFn: async () => {
        const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        const res = await fetch(`${baseURL}/api/v1/products/single-product/${slug}`, {
          next: { revalidate: 3600 },
        });
        const data = await res.json();
        if (data?.success) {
          return data.data;
        }
        return null;
      },
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductClient slug={slug} />
      </HydrationBoundary>
    );
  }

  // Prefetch category/manufacturer data server-side
  await queryClient.prefetchQuery({
    queryKey: productKeys.bySlugOrId(slug),
    queryFn: async () => {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(`${baseURL}/api/v1/products/${slug}`, {
        next: { revalidate: 3600 },
      });
      const data = await res.json();
      if (data?.success) {
        return data.data;
      }
      return null;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsDynamicClient slug={slug} />
    </HydrationBoundary>
  );
}