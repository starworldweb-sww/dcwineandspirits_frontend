import HomePageClient from "./components/HomePageClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/libs/get-query-client";
import { homeKeys } from "@/libs/queryKeys";
import { categoryService } from "./api/services/categoryService";
import { generateWebsiteSchema } from "@/libs/websiteSchema";


export default async function Page() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: homeKeys.allData(),
    queryFn: () => categoryService.getHomePageAllData(),
  });

  const websiteSchema = generateWebsiteSchema();
  return (
    <>
      <script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomePageClient />
      </HydrationBoundary>
    </>
  );
}
