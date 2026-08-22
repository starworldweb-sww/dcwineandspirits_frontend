import { useQuery } from "@tanstack/react-query";
import { sitemapKeys } from "@/libs/queryKeys";
import { sitemapService } from "../services/sitemapService";

export const useGetSitemapData = () => {
  return useQuery({
    queryKey: sitemapKeys.allData(),
    queryFn: () => sitemapService.getAllSitemapData(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetSitemapCategories = () => {
  return useQuery({
    queryKey: sitemapKeys.categories(),
    queryFn: () => sitemapService.getCategoriesForSitemap(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetSitemapProducts = () => {
  return useQuery({
    queryKey: sitemapKeys.products(),
    queryFn: () => sitemapService.getProductsForSitemap(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetSitemapBrands = () => {
  return useQuery({
    queryKey: sitemapKeys.brands(),
    queryFn: () => sitemapService.getBrandsForSitemap(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetSitemapBlogs = () => {
  return useQuery({
    queryKey: sitemapKeys.blogs(),
    queryFn: () => sitemapService.getBlogsForSitemap(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetSitemapBlogCategories = () => {
  return useQuery({
    queryKey: sitemapKeys.blogCategories(),
    queryFn: () => sitemapService.getBlogCategoriesForSitemap(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetSitemapInformation = () => {
  return useQuery({
    queryKey: sitemapKeys.information(),
    queryFn: () => sitemapService.getInformationPagesForSitemap(),
    staleTime: 5 * 60 * 1000,
  });
};
