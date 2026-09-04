import { mobileCategoryKeys } from "@/libs/queryKeys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMobileCategories } from "../services/mobileCategoryService";

export const useMobileCategory = () => {
  return useQuery({
    queryKey: mobileCategoryKeys.list(),
    queryFn: getMobileCategories,
    staleTime: 1000 * 60 * 60 * 24,      
    gcTime: 1000 * 60 * 60 * 24 * 2,    
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,          // tab switch karne pe refetch mat karo
    refetchOnMount: false,                // agar fresh hai to remount pe bhi refetch mat karo
  });
};