import { useMutation, useQuery } from "@tanstack/react-query";
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



export const useCountViews = () => {
  return useMutation({
    mutationKey: blogKeys.countViews(),
    mutationFn: (post_id) => blogService.countViews(post_id),
  });
};


export const useSearchPosts = ({ keyword, page = 1, limit = 10 }) => {
  return useQuery({
    queryKey: blogKeys.search({ keyword, page, limit }),
    queryFn: () => blogService.searchByKeyword({ keyword, page, limit }),
    enabled: !!keyword?.trim(), 
    keepPreviousData: true, 
  });
};