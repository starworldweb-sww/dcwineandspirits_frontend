import React from "react";
import SitemapClient from "./SitemapClient";
import { getQueryClient } from "@/libs/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { sitemapKeys } from "@/libs/queryKeys";
import { sitemapService } from "../api/services/sitemapService";

export const metadata = {
  title: "Sitemap | DC Wine & Spirits",
  description:
    "Complete sitemap of DC Wine & Spirits - browse all categories, products, brands, blogs, and information pages.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/sitemap/",
  },
};

const page = async () => {

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: sitemapKeys.allData(),
    queryFn: () => sitemapService.getAllSitemapData(),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SitemapClient />
      </HydrationBoundary>
    </>
  );
};

export default page;
