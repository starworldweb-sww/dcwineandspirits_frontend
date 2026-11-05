import { testimonialKeys } from "@/libs/queryKeys";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { testimonialServices } from "../services/testimonialService";

export const useGetTestimonials = (page = 1, limit = 12) => {
  return useQuery({
    queryKey: testimonialKeys.list(page, limit),
    queryFn: () => testimonialServices.getTestimonials(page, limit),
    placeholderData: keepPreviousData,
  });
};