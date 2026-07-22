import { categoryKeys, homeKeys } from "@/libs/queryKeys";
import HomePageClient from "./components/HomePageClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/libs/get-query-client";
import { categoryService } from "./api/services/categoryService";

export default async function Page() {
  // 1. Server pe ek per-request QueryClient banaya (naya QueryClient() ki
  //    jagah shared getQueryClient() helper use kiya - Provider.jsx wale
  //    config ke saath consistent rahega).
  const queryClient = getQueryClient();

  // 2. Homepage ke saare sections ka data yahan parallel prefetch ho raha hai -
  //    same query keys + service functions jo hooks mein already use ho rahe hain.
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: homeKeys.topBanner(),
      queryFn: () => categoryService.getHomePageTopBanner(),
    }),
    queryClient.prefetchQuery({
      queryKey: homeKeys.giftByOccasion(),
      queryFn: () => categoryService.getGiftByOccasion(),
    }),
    queryClient.prefetchQuery({
      queryKey: homeKeys.wineGifts(),
      queryFn: () => categoryService.getWineGifts(),
    }),
    queryClient.prefetchQuery({
      queryKey: homeKeys.topCategories(),
      queryFn: () => categoryService.getTopCategories(),
    }),
    queryClient.prefetchQuery({
      queryKey: homeKeys.pageProducts(),
      queryFn: () => categoryService.getHomePageProducts(),
    }),

     queryClient.prefetchQuery({
      queryKey: homeKeys.pageProducts(),
      queryFn: () => categoryService.getHomePageText(),
    }),
  ]);

  // 3. Dehydrated cache ko HydrationBoundary ke through HomePageClient (aur
  //    uske andar ke saare client components) ko pass kiya - unke useQuery
  //    hooks isi data ko turant use kar lenge, dobara fetch nahi karenge.
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageClient />
    </HydrationBoundary>
  );
}