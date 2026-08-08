"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
// import { useGetWishlist, useRemoveFromWishlist } from "@/app/api/hooks/useWishlist"; // apna actual path daal dena

// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

const sidebarLinks = [
  { href: "/account", label: "My Account" },
  { href: "/account/address", label: "Address Book" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/order", label: "Order History" },
  { href: "/account/transactions", label: "Transactions" },
];

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Account", href: "/account" },
  { label: "My Wish List", href: "/account/wishlist" },
];

const WishlistClient = () => {
  // const { data: wishlistItems = [], isLoading } = useGetWishlist();
  // const removeMutation = useRemoveFromWishlist();

  // Placeholder data — swap with real hook above
  const isLoading = false;
  const wishlistItems = [
    // {
    //   id: 1,
    //   image: "/placeholder.png",
    //   name: "La Marca Prosecco And Flutes Gift Set",
    //   slug: "la-marca-prosecco-and-flutes-gift-set",
    //   model: "dcgb390",
    //   inStock: true,
    //   price: "$99.00",
    // },
  ];

  const handleRemove = (id) => {
    // removeMutation.mutate(id, {
    //   onSuccess: () => toast.success("Removed from wishlist"),
    //   onError: (err) => toast.error(err?.message || "Failed to remove item"),
    // });
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (item) => {
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="My Wish List" breadcrumbs={breadcrumbs} />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        {/* Wishlist Table */}
        <div className="flex-1 min-w-0 w-full">
          {isLoading ? (
            <div className="bg-[#eeeeee] rounded-[4px] p-8">
              <p className="text-[14px] font-hind-madurai text-[#444444]">
                Loading your wishlist...
              </p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="bg-[#eeeeee] rounded-[4px] p-8 flex flex-col items-center text-center">
              <p className="text-[14px] leading-[1.7] font-hind-madurai text-[#444444] mb-6">
                You don&apos;t have any items in your wishlist yet. Start
                browsing and save your favorites here.
              </p>
              <Link href="/">
                <button className="bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 px-8 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer">
                  Continue Shopping
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-[#eeeeee] rounded-[4px] overflow-hidden">
                {/* Table header — hidden on small screens, shown from md up */}
                <div className="hidden md:grid grid-cols-[90px_1fr_120px_110px_120px_110px] items-center px-5 py-4 text-[13px] font-hind-madurai font-semibold uppercase tracking-[0.5px] text-[#333333] border-b border-[#d9d9d9]">
                  <span>Image</span>
                  <span>Product Name</span>
                  <span>Model</span>
                  <span>Stock</span>
                  <span>Unit Price</span>
                  <span>Action</span>
                </div>

                <div className="divide-y divide-[#d9d9d9]">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:grid md:grid-cols-[90px_1fr_120px_110px_120px_110px] md:items-center gap-3 md:gap-0 px-5 py-4"
                    >
                      <div className="w-16 h-16 md:w-[70px] md:h-[70px] relative shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <Link
                        href={`/${item.slug}`}
                        className="text-[14px] font-hind-madurai transition-opacity duration-200 hover:opacity-80"
                        style={{ color: ACCENT }}
                      >
                        {item.name}
                      </Link>

                      <span className="text-[14px] font-hind-madurai text-[#444444]">
                        {item.model}
                      </span>

                      <span
                        className={`text-[14px] font-hind-madurai font-medium ${
                          item.inStock ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </span>

                      <span className="text-[14px] font-hind-madurai text-[#333333]">
                        {item.price}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          aria-label="Add to cart"
                          className="w-9 h-9 flex items-center justify-center bg-black text-white transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer"
                        >
                          <ShoppingBag size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          aria-label="Remove from wishlist"
                          className="w-9 h-9 flex items-center justify-center bg-black text-white transition-colors duration-300 hover:bg-[#8c1a3c] cursor-pointer"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/">
                <button className="w-full bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 mt-4 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer">
                  Continue
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Right Column: Sidebar — hidden on phone/tablet, visible from lg up */}
        <div className="hidden lg:block w-full lg:w-[260px] shrink-0">
          <div className="bg-[#eeeeee] rounded-[4px] p-5">
            <ul>
              {sidebarLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 py-2.5 text-[15px] font-hind-madurai text-[#333333] transition-colors duration-300"
                  >
                    <ChevronRight
                      size={16}
                      className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                      style={{ color: ACCENT }}
                    />
                    <span className="transition-colors duration-300 group-hover:text-[#8c1a3c]">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistClient;