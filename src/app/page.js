import { categoryKeys } from "@/libs/queryKeys";
import HomePageClient from "./components/HomePageClient";

import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { categoryService } from "./api/services/categoryService";


export default async function Page() {




  return (
    
      <HomePageClient />
    
  );
}