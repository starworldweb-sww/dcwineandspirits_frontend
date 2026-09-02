"use client";

import React from "react";
import Link from "next/link";
import ProductsHeader from "../components/TittleAndBreadcrumb";
import { useGetSitemapData } from "../api/hooks/useSitemapData";
import { FileText, FolderOpen } from "lucide-react";

const staticAccountLinks = [
  {
    heading: "Special Offers",
    items: [{ label: "Special Offers", href: "/specials" }],
  },
  {
    heading: "My Account",
    items: [
      { label: "My Account", href: "/account" },
      { label: "Account Information", href: "/account/edit" },
      { label: "Password", href: "/account/password" },
      { label: "Address Book", href: "/account/address" },
      { label: "Order History", href: "/account/orders" },
      { label: "Downloads", href: "/account/downloads" },
    ],
  },
  {
    heading: null,
    items: [
      { label: "Shopping Cart", href: "/cart" },
      { label: "Checkout", href: "/checkout" },
      { label: "Search", href: "/search" },
    ],
  },
];

const staticInfoHeading = {
  heading: "Information",
  items: [
    { label: "Coupon & Deals", href: "/coupon-and-deals" },
    { label: "Frequently Asked Questions", href: "/frequently-asked-questions" },
    { label: "About Us", href: "/about-us" },
    { label: "Delivery & Shipping Policy", href: "/shipping-and-delivery-policy" },
    { label: "Return Policy", href: "/return-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Contact Us", href: "/contact" },
  ],
};

const FolderIcon = () => (
  <FolderOpen
    size={16}
    className="mr-2 mt-1 inline-block flex-shrink-0 text-[#8a1538]"
    strokeWidth={2}
  />
);

const FileIcon = () => (
  <FileText
    size={14}
    className="mr-2 mt-[3px] inline-block flex-shrink-0 text-[#8a1538]"
    strokeWidth={2}
  />
);

const renderCategoryTree = (categories, depth = 0) => {
  if (!categories || !categories.length) return null;

  return (
    <ul className="space-y-2" style={{ paddingLeft: depth > 0 ? "1.25rem" : 0 }}>
      {categories.map((cat) => (
        <li key={cat.id}>
          <Link
            href={`/${cat.slug}`}
            className="group flex items-start text-[#8a1538] hover:underline"
          >
            {cat.children && cat.children.length > 0 ? <FolderIcon /> : <FileIcon />}
            <span className="font-medium">{cat.name}</span>
          </Link>
          {cat.children && cat.children.length > 0 && (
            <div className="mt-2">{renderCategoryTree(cat.children, depth + 1)}</div>
          )}
        </li>
      ))}
    </ul>
  );
};

const SitemapSection = ({ heading, children, className = "" }) => {
  return (
    <div
      className={`mb-8 rounded-sm border border-gray-100 bg-gradient-to-b from-gray-50 to-white p-5 shadow-sm ${className}`}
    >
      {heading && (
        <h2 className="mb-4 flex items-center border-b border-gray-200 pb-2 font-serif text-[18px] md:text-[20px] font-bold text-[#333]">
          <FolderIcon />
          {heading}
        </h2>
      )}
      <div>{children}</div>
    </div>
  );
};

const SitemapClient = () => {
  const { data, isLoading } = useGetSitemapData();

  const categoryTree = data?.categories?.tree || [];
  const brands = data?.brands || [];
  const blogs = data?.blogs || [];
  const blogCategories = data?.blogCategories || [];
  const infoPages = data?.infoPages || [];


  
  const infoPageUrls = new Map(
    staticInfoHeading.items.map((i) => [i.href, i.label])
  );

  return (
    <main className="select-none bg-white min-h-screen flex flex-col w-full font-hind-madurai text-[#333333]">
      <div className="w-full">
        <ProductsHeader categoryName="Sitemap" />
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 2xl:px-12 py-8 md:py-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#8a1538]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <SitemapSection heading="Categories">
                {categoryTree.length > 0 ? (
                  renderCategoryTree(categoryTree)
                ) : (
                  <p className="text-sm text-gray-500">No categories found.</p>
                )}
              </SitemapSection>
            </div>

            <div className="space-y-2">
              {staticAccountLinks.map((section, idx) => (
                <SitemapSection key={idx} heading={section.heading}>
                  <ul className="space-y-2 pl-0">
                    {section.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="flex items-start text-[#8a1538] hover:underline"
                        >
                          <FileIcon />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </SitemapSection>
              ))}

              <SitemapSection heading={staticInfoHeading.heading}>
                <ul className="space-y-2">
                  {infoPages.length > 0 &&
                    infoPages.map((info) => {
                      const href = `/${info.slug}`;
                      const label = infoPageUrls.get(href);
                      return (
                        <li key={info.id}>
                          <Link
                            href={href}
                            className="flex items-start text-[#8a1538] hover:underline"
                          >
                            <FileIcon />
                            <span>{label || info.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  {staticInfoHeading.items
                    .filter((it) => {
                      const slugFromHref = it.href.replace(/^\//, "");
                      return !infoPages.some((ip) => ip.slug === slugFromHref);
                    })
                    .map((staticInfo) => (
                      <li key={staticInfo.label}>
                        <Link
                          href={staticInfo.href}
                          className="flex items-start text-[#8a1538] hover:underline"
                        >
                          <FileIcon />
                          <span>{staticInfo.label}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </SitemapSection>

              <SitemapSection heading="Brands">
                {brands.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {brands.map((brand) => (
                      <li key={brand.id}>
                        <Link
                          href={`/${brand?.slug}`}
                          className="flex items-start text-[#8a1538] hover:underline"
                        >
                          <FileIcon />
                          <span>{brand.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No brands found.</p>
                )}
              </SitemapSection>

              <SitemapSection heading="Blogs">
                {blogCategories.length > 0 ? (
                  <ul className="space-y-3">
                    {blogCategories.map((bc) => (
                      <li key={bc.id}>
                        <Link
                          href={`/blogs/${bc.slug}`}
                          className="flex items-start text-[#8a1538] hover:underline font-medium"
                        >
                          <FolderIcon />
                          <span>{bc.name}</span>
                        </Link>
                      </li>
                    ))}
                    <li className="pt-3 border-t border-gray-100">
                      <ul className="space-y-2 pl-6">
                        {blogs.slice(0, 10).map((blog) => (
                          <li key={blog.id}>
                            <Link
                              href={`/blogs/${blog.slug}`}
                              className="flex items-start text-[#8a1538] hover:underline text-sm"
                            >
                              <FileIcon />
                              <span>{blog.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-2">
                    {blogs.slice(0, 10).map((blog) => (
                      <li key={blog.id}>
                        <Link
                          href={`/blogs/${blog.slug}`}
                          className="flex items-start text-[#8a1538] hover:underline"
                        >
                          <FileIcon />
                          <span>{blog.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </SitemapSection>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default SitemapClient;
