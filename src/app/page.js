import HomePageClient from "./components/HomePageClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/libs/get-query-client";
import { homeKeys } from "@/libs/queryKeys";
import { categoryService } from "./api/services/categoryService";

export default async function Page() {
  const queryClient = getQueryClient();

  // const allData = await categoryService.getHomePageAllData();
  // queryClient.setQueryData(homeKeys.allData(), allData);

  // if (allData) {
  //   queryClient.setQueryData(homeKeys.topCategory(), allData.topCategory ?? null);
  //   queryClient.setQueryData(homeKeys.giftDropDown(), allData.giftDropDown ?? null);
  //   queryClient.setQueryData(homeKeys.giftDropDownShopByCategory(), allData.shopByCategory ?? null);
  //   queryClient.setQueryData(homeKeys.giftDropDownGiftByOrigin(), allData.giftByOrigin ?? null);
  //   queryClient.setQueryData(homeKeys.giftDropDownShopByPrice(), allData.shopByPrice ?? null);
  //   queryClient.setQueryData(homeKeys.shopByBrand(), allData.shopByBrand ?? null);
  //   queryClient.setQueryData(homeKeys.personalization(), allData.personalization ?? null);
  //   queryClient.setQueryData(homeKeys.wineGifts(), allData.wineGift ?? null);
  //   queryClient.setQueryData(homeKeys.occasionTreasures(), allData.occasionTreasures ?? null);
  //   queryClient.setQueryData(homeKeys.occasionMenu(), allData.occasionMenu ?? null);

  //   queryClient.setQueryData(homeKeys.topBanner(), allData.homeTopBanner ?? null);
  //   queryClient.setQueryData(homeKeys.topCategories(), allData.topCategories ?? null);
  //   queryClient.setQueryData(homeKeys.loveByBanner(), allData.loveBanners ?? null);
  //   queryClient.setQueryData(homeKeys.giftByOccasion(), allData.giftByOccasion ?? null);
  //   queryClient.setQueryData(homeKeys.pageProducts(), allData.homePageProducts ?? null);
  //   queryClient.setQueryData(homeKeys.shopByBrandTitle(), allData.shopByBrandTitle ?? null);
  //   queryClient.setQueryData(homeKeys.pageText(), allData.homePageText ?? null);
  // }

  await queryClient.prefetchQuery({
    queryKey: homeKeys.allData(),
    queryFn: () => categoryService.getHomePageAllData(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageClient />
    </HydrationBoundary>
  );
}
