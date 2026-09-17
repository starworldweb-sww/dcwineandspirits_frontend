import React from "react";
import BlogClient from "./BlogClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/libs/get-query-client";
import { blogKeys } from "@/libs/queryKeys";
import { blogService } from "@/app/api/services/blogService";
import { generateArticleSchema } from "@/libs/aricleSchema";
import { getMetaByType } from "@/libs/getMetaByType";
import AuthorBox from "./AuthorBox";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const allCategories = await blogService.getAllCategory();
  const matchedCategory = allCategories?.find((c) => c.slug === slug);
  const meta = await getMetaByType("blog", slug);

  const canonicalUrl = `https://www.dcwineandspirits.com/blogs/${slug}`;

  if (matchedCategory) {
    const ogTitle =
      meta?.meta_title || `${matchedCategory.name} | DC Wine and Spirits Blog`;
    const ogDescription =
      meta?.meta_description ||
      `Browse ${matchedCategory.name} articles on DC Wine and Spirits.`;

    return {
      title: ogTitle,
      description: ogDescription,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: canonicalUrl,
        siteName: "DC Wine and Spirits",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description: ogDescription,
      },
    };
  }

  const initialPostData = await blogService.getPostBySlug(slug);

  const postImage = initialPostData?.image
    ? `${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL}${initialPostData.image}`
    : null;

  const ogTitle =
    meta?.meta_title || initialPostData?.title || "Blog | DC Wine and Spirits";
  const ogDescription =
    meta?.meta_description || "Read the latest blog from DC Wine and Spirits.";

  return {
    title: ogTitle,
    description: ogDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: "DC Wine and Spirits",
      type: "article",
      publishedTime: initialPostData?.date_created,
      modifiedTime: initialPostData?.date_updated,
      authors: initialPostData
        ? [
            `${initialPostData.author_firstname} ${initialPostData.author_lastname}`,
          ]
        : undefined,
      ...(postImage && {
        images: [
          {
            url: postImage,
            width: 1200,
            height: 630,
            alt: initialPostData?.title || ogTitle,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      ...(postImage && { images: [postImage] }),
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


  console.log("initialPostData", initialPostData);

  await queryClient.prefetchQuery({
    queryKey: blogKeys.postBySlug(slug),
    queryFn: () => Promise.resolve(initialPostData),
  });



  // recommended fetch


    const recommendedPosts = initialPostData
  ? await blogService.getRecommendedPosts(initialPostData.post_id, { limit: 10 })
  : null;

if (initialPostData) {
  await queryClient.prefetchQuery({
    queryKey: blogKeys.recommendedPosts(initialPostData.post_id, { limit: 10 }),
    queryFn: () => Promise.resolve(recommendedPosts),
  });
}


  const articleSchema = initialPostData
    ? generateArticleSchema(initialPostData)
    : null;

  return (
    <div>
      {articleSchema && (
        <script
          id="dynamicblog-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BlogClient viewType="post" initialPostData={initialPostData} />
      </HydrationBoundary>
    </div>
  );
};

export default page;
