import { getAuthorBySlug } from "@/libs/authors";
import AuthorPostsClient from "./AuthorsPostsClient";


export async function generateMetadata({ params }) {
  const { id } = await params; // ye actually slug hai (e.g. "sam-gera")
  const author = getAuthorBySlug(id);

  if (!author) {
    return {
      title: "Author Not Found | DC Wine & Spirits",
      robots: { index: false, follow: false },
    };
  }

  const title = `${author.name} | DC Wine & Spirits`;
  const description =
    author.bio?.slice(0, 155) || `Read articles by ${author.name} on DC Wine & Spirits.`;
  const url = `https://www.dcwineandspirits.com/author/${id}/`;
  const imageUrl = author.image?.startsWith("http")
    ? author.image
    : `https://www.dcwineandspirits.com${author.image}`;

  return {
    title,
    robots: {
      index: true,
      follow: true,
    },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "DC Wine & Spirits",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${author.name} - DC Wine & Spirits Author`,
        },
      ],
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  return <AuthorPostsClient authorSlug={id} />;
}