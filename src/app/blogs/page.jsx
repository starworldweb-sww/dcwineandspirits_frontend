import React from 'react'
import BlogsClient from './BlogsClient'
import { getQueryClient } from '@/libs/get-query-client';
import { blogService } from '../api/services/blogService';
import { blogKeys } from '@/libs/queryKeys';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getMetaByType } from '@/libs/getMetaByType';


// export const metadata = {
//   title: "Wine & Spirits Blogs | Expert Advice, Pairing Tips & Gift Ideas",
//   description:
//     "Discover expert wine and spirits advice, food pairing tips, and creative celebration ideas on the DC Wine and Spirits blog. Read our latest articles and guides.",
//   alternates: {
//     canonical: "https://www.dcwineandspirits.com/blogs/",
//   },
// };


export async function generateMetadata({ params }) {
  const { slug } = await params;
 
  // const matchedCategory = allCategories?.find((c) => c.slug === slug);
  const meta = await getMetaByType("blog", slug)
  console.log("meta", meta)
  if (meta) {
    return {
      title: `${meta?.meta_title}`,
      description:
        meta.meta_description ||
        `Browse all blogs in the ${meta.meta_description} category on DC Wine and Spirits.`,
      alternates: {
        canonical: `https://www.dcwineandspirits.com/blogs/${slug}`,
      },
    };
  }

  return {
    title: "Wine & Spirits Blogs | Expert Advice, Pairing Tips & Gift Ideas",
    description:
      "Discover expert wine and spirits advice, food pairing tips, and creative celebration ideas on the DC Wine and Spirits blog. Read our latest articles and guides.",
    alternates: {
      canonical: `https://www.dcwineandspirits.com/blogs/${slug}`,
    },
  };
}
const page = async () => {

  const queryClient = getQueryClient();
  const initialData = await blogService.getAllPosts({ page: 1, limit: 10 });

  await queryClient.prefetchQuery({
    queryKey: blogKeys.posts({ page: 1, limit: 10 }),
    queryFn: () => Promise.resolve(initialData),
  });


  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BlogsClient initialData={initialData} />
      </HydrationBoundary>
    </>
  )
}

export default page
