"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Plus, Minus, RefreshCw, X, ShoppingBag } from "lucide-react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb"; // agar login page waala component hai to reuse kar lo
import { useGetCartList } from "@/app/api/hooks/cart/useGetCartList";
import { decodeHtml } from "@/libs/decodeHtml";
import { useupdatedCart } from "@/app/api/hooks/cart/useUpdatedCart";
import { useRemoveFromCart } from "@/app/api/hooks/cart/useRemoveFromCart"; // 👈 Hook imported here

const ACCENT = "#98022e";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ""; // 👈 apna actual base URL daal dena

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Shopping Cart", href: "/cart" },
];

const CartClient = () => {
  const { data, isLoading, isError } = useGetCartList();
  const updatedCartMut = useupdatedCart();
  const removeCartMut = useRemoveFromCart(); // 👈 Hook initialized here

  // 👇 API response ka shape yahan map kar rahe hain UI ke expected format me
  //    Apne actual response ke hisaab se yeh mapping adjust kar lena
  const [items, setItems] = useState([]);
  const [openSection, setOpenSection] = useState(null); // "coupon" | "shipping" | "gift" | null

  useEffect(() => {
    const list = data?.items || [];
    setItems(
      list.map((item) => {
        const product = item.product || {};
        const price = product.special_price ?? product.price ?? 0;
        return {
          id: item.cart_id,
          image: product.image
            ? `${IMAGE_BASE_URL}/${product.image}` // 👈 apna actual image CDN/base path daal dena
            : "/products/placeholder.webp",
          name: product.name,
          model: product.model ?? product.sku ?? String(product.product_id ?? ""),
          qty: item.quantity ?? 1,
          unitPrice: parseFloat(price) || 0,
        };
      })
    );
  }, [data]);

  const toggleSection = (section) =>
    setOpenSection((prev) => (prev === section ? null : section));

  // qty change ab UI state ke saath-saath useupdatedCart mutation bhi fire karta hai
  const updateQty = (id, delta) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    const newQty = Math.max(1, target.qty + delta);

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
    );

    updatedCartMut.mutate({ cart_id: id, quantity: newQty });
  };

  // useRemoveFromCart hook milte hi yahan mutate(id) call laga diya
  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    removeCartMut.mutate(id); // 👈 Mutation called here
  };

  const subTotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const taxRate = 0.0625;
  const tax = subTotal * taxRate;
  const total = subTotal + tax;

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      {/* Header / Breadcrumb — reuse existing component if available */}
      {ProductsHeader ? (
        <ProductsHeader categoryName="Shopping Cart" breadcrumbs={breadcrumbs} />
      ) : (
        <div className="bg-[#f5f5f5] py-10 text-center border-b border-gray-200">
          <h1 className="text-[32px] font-hind-madurai font-normal">
            Shopping Cart
          </h1>
          <div className="w-14 h-[2px] bg-[#333] mx-auto mt-2 mb-4" />
          <div className="flex items-center justify-center gap-1.5 text-sm text-[#666]">
            <Home size={14} />
            <span>/ Shopping Cart</span>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-6 lg:mt-10 mb-14">
        {/* LEFT: Cart Items */}
        <div className="flex-1 min-w-0 w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-[#f8f8f8] rounded-[4px]">
              <p className="text-[15px] font-hind-madurai text-[#666]">
                Loading your cart...
              </p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-[#f8f8f8] rounded-[4px]">
              <p className="text-[15px] font-hind-madurai text-[#666]">
                Something went wrong while loading your cart.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-[#f8f8f8] rounded-[4px]">
              <ShoppingBag size={40} className="text-gray-300 mb-3" />
              <p className="text-[15px] font-hind-madurai text-[#666]">
                Your shopping cart is empty.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE — hidden on mobile */}
              <div className="hidden md:block w-full overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f2f2f2] text-left">
                      <th className="px-4 py-3 text-[13px] font-hind-madurai font-semibold uppercase tracking-wide text-[#333]">
                        Image
                      </th>
                      <th className="px-4 py-3 text-[13px] font-hind-madurai font-semibold uppercase tracking-wide text-[#333]">
                        Product Name
                      </th>
                      <th className="px-4 py-3 text-[13px] font-hind-madurai font-semibold uppercase tracking-wide text-[#333]">
                        Model
                      </th>
                      <th className="px-4 py-3 text-[13px] font-hind-madurai font-semibold uppercase tracking-wide text-[#333]">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-[13px] font-hind-madurai font-semibold uppercase tracking-wide text-[#333]">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-[13px] font-hind-madurai font-semibold uppercase tracking-wide text-[#333]">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="px-4 py-4 w-20">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-contain w-16 h-16"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/product/${item.id}`}
                            className="text-[14px] font-hind-madurai font-medium hover:opacity-80 transition-opacity"
                            style={{ color: ACCENT }}
                          >
                            {decodeHtml(item.name)}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-[14px] font-hind-madurai text-[#555]">
                          {item.model}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-[#d9d9d9] rounded-[3px] overflow-hidden">
                              <input
                                type="text"
                                readOnly
                                value={item.qty}
                                className="w-10 text-center text-[14px] py-1.5 outline-none"
                              />
                              <div className="flex flex-col border-l border-[#d9d9d9]">
                                <button
                                  onClick={() => updateQty(item.id, 1)}
                                  className="px-1.5 hover:bg-gray-100 transition-colors"
                                >
                                  <Plus size={10} />
                                </button>
                                <button
                                  onClick={() => updateQty(item.id, -1)}
                                  className="px-1.5 border-t border-[#d9d9d9] hover:bg-gray-100 transition-colors"
                                >
                                  <Minus size={10} />
                                </button>
                              </div>
                            </div>
                            <button
                              title="Update cart"
                              disabled={updatedCartMut.isPending}
                              className="flex items-center justify-center w-9 h-9 bg-black text-white hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                            >
                              <RefreshCw size={14} />
                            </button>
                            <button
                              title="Remove item"
                              onClick={() => removeItem(item.id)}
                              disabled={removeCartMut.isPending}
                              className="flex items-center justify-center w-9 h-9 bg-black text-white hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[14px] font-hind-madurai">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-[14px] font-hind-madurai font-semibold">
                          ${(item.unitPrice * item.qty).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS — hidden on desktop */}
              <div className="md:hidden flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 border border-gray-100 rounded-[6px] p-3 bg-white shadow-sm"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={72}
                      height={72}
                      className="object-contain w-[72px] h-[72px] shrink-0 rounded"
                    />

                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <Link
                        href={`/product/${item.id}`}
                        className="text-[14px] font-hind-madurai font-medium leading-snug"
                        style={{ color: ACCENT }}
                      >
                        {item.name}
                      </Link>
                      <span className="text-[12px] font-hind-madurai text-[#888]">
                        Model: {item.model}
                      </span>

                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center border border-[#d9d9d9] rounded-[3px] overflow-hidden">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-[13px]">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="px-2.5 py-1.5 border-l border-[#d9d9d9] hover:bg-gray-100 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          title="Remove item"
                          onClick={() => removeItem(item.id)}
                          disabled={removeCartMut.isPending}
                          className="flex items-center justify-center w-8 h-8 bg-black text-white rounded-[3px] disabled:opacity-50"
                        >
                          <X size={13} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-gray-100">
                        <span className="text-[12px] font-hind-madurai text-[#888]">
                          ${item.unitPrice.toFixed(2)} each
                        </span>
                        <span className="text-[14px] font-hind-madurai font-semibold">
                          ${(item.unitPrice * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Summary Sidebar */}
        <div className="w-full lg:w-[340px] shrink-0 mt-8 lg:mt-0">
          <div className="bg-[#f7f7f7] rounded-[4px] p-6">
            <h2 className="text-[18px] font-hind-madurai font-semibold text-[#333] pb-3 mb-3 border-b border-[#333]">
              What would you like to do next?
            </h2>

            {/* Accordion Rows */}
            {[
              { key: "coupon", label: "Use Coupon Code" },
              { key: "shipping", label: "Estimate Shipping & Taxes" },
              { key: "gift", label: "Use Gift Certificate" },
            ].map((section) => (
              <div key={section.key} className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between py-3.5 text-[13px] font-hind-madurai font-semibold uppercase tracking-wide text-[#555] hover:text-[#333] transition-colors"
                >
                  {section.label}
                  <span className="flex items-center justify-center w-5 h-5 border border-gray-400 rounded-sm text-[14px] leading-none">
                    {openSection === section.key ? "−" : "+"}
                  </span>
                </button>
                {openSection === section.key && (
                  <div className="pb-4 text-[13px] font-hind-madurai text-[#666]">
                    {section.key === "coupon" && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          className="flex-1 border border-[#d9d9d9] rounded-[3px] px-3 py-2 text-[13px] outline-none focus:border-[#98022e]"
                        />
                        <button className="bg-black text-white text-[12px] font-semibold uppercase px-4 rounded-[3px] hover:bg-[#1a1a1a] transition-colors">
                          Apply
                        </button>
                      </div>
                    )}
                    {section.key === "shipping" && (
                      <p>Enter your destination to estimate shipping & taxes.</p>
                    )}
                    {section.key === "gift" && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter gift certificate code"
                          className="flex-1 border border-[#d9d9d9] rounded-[3px] px-3 py-2 text-[13px] outline-none focus:border-[#98022e]"
                        />
                        <button className="bg-black text-white text-[12px] font-semibold uppercase px-4 rounded-[3px] hover:bg-[#1a1a1a] transition-colors">
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Totals */}
            <div className="mt-5 bg-white rounded-[4px] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <span className="text-[13px] font-hind-madurai font-semibold uppercase text-[#333]">
                  Sub-Total:
                </span>
                <span className="text-[14px] font-hind-madurai">
                  ${subTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-[#fafafa]">
                <span className="text-[13px] font-hind-madurai font-semibold uppercase text-[#333]">
                  Tax ({(taxRate * 100).toFixed(2)}%):
                </span>
                <span className="text-[14px] font-hind-madurai">
                  ${tax.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-[14px] font-hind-madurai font-bold uppercase text-[#333]">
                  Total:
                </span>
                <span
                  className="text-[15px] font-hind-madurai font-bold"
                  style={{ color: ACCENT }}
                >
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            <a href="/checkout">
              <button className="w-full cursor-pointer mt-5 bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 hover:bg-[#1a1a1a] transition-colors">
                Proceed to Checkout
              </button>
            </a>  
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartClient;