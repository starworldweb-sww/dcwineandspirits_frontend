import { useQuery } from "@tanstack/react-query";
import { blogKeys } from "@/libs/queryKeys";       // jahan tumne blogKeys define kiya
import { blogService } from "../../services/blogService"; // apna actual path daal dena

export const useGetAllPosts = (params = {}) => {
  return useQuery({
    queryKey: blogKeys.posts(params),
    queryFn: () => blogService.getAllPosts(params),
  });
};

export const useGetPostBySlug = (slug) => {
  return useQuery({
    queryKey: blogKeys.postBySlug(slug),
    queryFn: () => blogService.getPostBySlug(slug),
    enabled: Boolean(slug),
  });
};