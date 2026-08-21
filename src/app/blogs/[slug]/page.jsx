import React from 'react'
import BlogClient from './BlogClient'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/libs/get-query-client';
import { blogKeys } from '@/libs/queryKeys';
import { blogService } from '@/app/api/services/blogService';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const allCategories = await blogService.getAllCategory();
  const matchedCategory = allCategories?.find((c) => c.slug === slug);

  if (matchedCategory) {
    return {
      title: `${matchedCategory.name} Blogs | DC Wine and Spirits`,
      description:
        matchedCategory.description ||
        `Browse all blogs in the ${matchedCategory.name} category on DC Wine and Spirits.`,
      alternates: {
        canonical: `https://www.dcwineandspirits.com/blogs/${slug}`,
      },
    };
  }

  return {
    title: "Blog | DC Wine and Spirits",
    description: "Read the latest blog from DC Wine and Spirits.",
    alternates: {
      canonical: `https://www.dcwineandspirits.com/blogs/${slug}`,
    },
  };
}

const page = async ({ params }) => {
  const { slug } = await params;
  const queryClient = getQueryClient();

  const allCategories = await blogService.getAllCategory();
  const matchedCategory = allCategories?.find((c) => c.slug === slug);

  await queryClient.prefetchQuery({
    queryKey: blogKeys.getCategory(),
    queryFn: () => Promise.resolve(allCategories),
  });

  if (matchedCategory) {
    const categoryPosts = await blogService.getAllPosts({
      page: 1,
      limit: 10,
      categorySlug: slug,
      categoryId: matchedCategory.category_id,
    });

    await queryClient.prefetchQuery({
      queryKey: blogKeys.posts({
        page: 1,
        limit: 10,
        categorySlug: slug,
        categoryId: matchedCategory.category_id,
      }),
      queryFn: () => Promise.resolve(categoryPosts),
    });

    return (
      <div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <BlogClient
            viewType="category"
            category={matchedCategory}
            initialCategoryPosts={categoryPosts}
          />
        </HydrationBoundary>
      </div>
    );
  }

  const initialPostData = await blogService.getPostBySlug(slug);

  await queryClient.prefetchQuery({
    queryKey: blogKeys.postBySlug(slug),
    queryFn: () => Promise.resolve(initialPostData),
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BlogClient
          viewType="post"
          initialPostData={initialPostData}
        />
      </HydrationBoundary>
    </div>
  );
};

export default page;
