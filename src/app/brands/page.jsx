import React from 'react';
import BrandsClient from './BrandsClient';
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/libs/get-query-client";
import { productsService } from "../api/services/productsService"; // path apne project ke hisaab se confirm kar lena
import { manufacturerKeys } from "@/libs/queryKeys";

export const metadata = {
  title: "Find Your Favorite Wine & Champagne Brands | DC Wine & Spirits",
  description:
    "Browse our wide selection of wine and champagne brands available as gifts. Discover top-rated labels handpicked for quality, taste, and elegant presentation.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/brands/",
  },
};


const page = async () => {
  const queryClient = getQueryClient();

  
  await queryClient.prefetchQuery({
    queryKey: manufacturerKeys.allManufacturers({}),
    queryFn: () => productsService.getAllManufacturers({}),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BrandsClient />
    </HydrationBoundary>
  );
};

export default page;