"use client";

import React, { useState } from "react";
import {
  Check,
  Dot,
  X,
  ChevronUp,
  ChevronDown,
  Heart,
  Repeat,
  ShoppingBag,
  Gift,
  Truck,
  Download,
  HelpCircle,
  Star,
} from "lucide-react";
import { Sumana, Hind_Madurai } from "next/font/google";
import ProductsHeader from "../../components/TittleAndBreadcrumb";
import { useAddtoCart } from "@/app/api/hooks/cart/useAddtoCart";
import { toast } from "sonner";

const sumana = Sumana({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const hindMadurai = Hind_Madurai({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export default function ProductMain({ product }) {
  const [stock] = useState(product.quantity > 0);
  const productImage = product.image 
    ? `https://www.dcwineandspirits.com/image/${product.image}` 
    : "/prosecco-gift-800x800.webp";
  const [mainImage, setMainImage] = useState(productImage);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("center center");
  const [giftMessage, setGiftMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const addToCartMut = useAddtoCart();
  const isAddingToCart = addToCartMut.isPending;

  const reviews = product.reviews || [];
  const reviewCount = reviews.length;
  const averageRating = product.average_rating || 0;

  const productImages = product.images?.map(img => 
    img.image ? `https://www.dcwineandspirits.com/image/${img.image}` : null
  ).filter(Boolean) || [];
  
  const allImages = productImages.length
    ? [productImage, ...productImages]
    : [productImage];

  const originalPrice = product.price;
  const specialPrice = product.special_price;
  const hasSpecialPrice = specialPrice !== null && specialPrice !== undefined;

  const brandName = product.manufacturer?.name || "";
  const brandurl = product.manufacturer?.manufacturer_seo_url || "";
 
  const handleImageChange = (clickedImage) => {
    setMainImage(clickedImage);
    setIsImageHovered(false);
    setZoomOrigin("center center");
  };

  const handleImageMove = (e) => {
    const imageBox = e.currentTarget.getBoundingClientRect();
    const mouseXPercent = ((e.clientX - imageBox.left) / imageBox.width) * 100;
    const mouseYPercent = ((e.clientY - imageBox.top) / imageBox.height) * 100;
    setZoomOrigin(`${mouseXPercent}% ${mouseYPercent}%`);
  };

  const handleAddToCartClick = async () => {
    const productId = product?.product_id || product?.id;
    if (!productId || isAddingToCart || !stock) return;

    try {
      const res = await addToCartMut.mutateAsync({
        product_id: productId,
        quantity: Math.max(1, Number(quantity) || 1),
      });
      if (res?.success) {
        toast.success(res.message || "Added to cart!");
      }
    } catch (e) {
    }
  };

  const handleAddToWishlistClick = () => {
    console.log("Add to wishlist", product.product_id);
  };

  const handleWriteReviewClick = () => {
    console.log("Write a review clicked for", product.product_id);
  };

  return (
    <>
      <ProductsHeader categoryName={product.name} />
      <main className={`min-h-screen w-full bg-white ${hindMadurai.className}`}>
        <section className="bg-white px-3 2xl:px-32 py-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            <div className="w-full lg:w-auto flex flex-row gap-3 lg:gap-4">
              {allImages.length > 1 && (
                <div className="flex flex-col gap-3 w-14 sm:w-16 lg:w-20 flex-shrink-0">
                  {allImages.map((imageUrl, index) => (
                    <div
                      key={`${imageUrl}-${index}`}
                      onClick={() => handleImageChange(imageUrl)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border-2 cursor-pointer overflow-hidden bg-white p-1 transition-all ${
                        mainImage === imageUrl
                          ? "border-[#98022e]"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseMove={handleImageMove}
                onMouseLeave={() => {
                  setIsImageHovered(false);
                  setZoomOrigin("center center");
                }}
                className="w-full min-w-0 lg:w-[486px] lg:flex-none flex justify-center items-center bg-white border border-gray-200 overflow-hidden cursor-zoom-in aspect-square lg:h-[486px]"
              >
                <img
                  src={mainImage}
                  alt={product.name}
                  draggable={false}
                  className="w-full h-full object-cover object-center select-none will-change-transform"
                  style={{
                    transform: isImageHovered ? "scale(2.2)" : "scale(1)",
                    transformOrigin: zoomOrigin,
                    transition: isImageHovered
                      ? "transform 120ms ease-out"
                      : "transform 220ms ease-out",
                  }}
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2 min-w-0 flex flex-col justify-between">
              <div className="bg-[#f8f8f8] p-5 sm:p-6 lg:h-[486px] lg:overflow-y-auto">
                <div className="flex items-stretch justify-between gap-4 pb-4 border-b border-gray-200">
                  <div className="flex items-stretch gap-4">
                    <div className={`${sumana.className} flex flex-col justify-center`}>
                      {hasSpecialPrice ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-lg text-gray-400 line-through">
                            ${Number(originalPrice).toFixed(2)}
                          </span>
                          <h1 className="font-bold text-2xl lg:text-3xl text-black">
                            ${Number(specialPrice).toFixed(2)}
                          </h1>
                        </div>
                      ) : (
                        <h1 className="font-bold text-2xl lg:text-3xl text-black">
                          ${Number(originalPrice).toFixed(2)}
                        </h1>
                      )}
                    </div>

                    <div className="w-px bg-gray-300" />

                    <div className="flex flex-col gap-1 text-sm justify-center">
                      <div className="flex items-center gap-1">
                        {stock ? (
                          <Check
                            className="text-green-500"
                            size={16}
                            strokeWidth={3}
                          />
                        ) : (
                          <X
                            className="text-red-500"
                            size={16}
                            strokeWidth={2.5}
                          />
                        )}
                        <span
                          className={
                            stock
                              ? "text-green-600 font-bold"
                              : "text-red-600 font-bold"
                          }
                        >
                          {stock ? "IN STOCK" : "OUT OF STOCK"}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Dot strokeWidth={2.75} size={18} />
                        Model: {product.model}
                      </div>

                      {product.sku && (
                        <div className="flex items-center text-gray-600">
                          <Dot strokeWidth={2.75} size={18} />
                          SKU: {product.sku}
                        </div>
                      )}

                      {product.upc && (
                        <div className="flex items-center text-gray-600">
                          <Dot strokeWidth={2.75} size={18} />
                          UPC: {product.upc}
                        </div>
                      )}
                    </div>
                  </div>

                  {brandName && (
                    <div className="w-[120px] h-[60px] flex-shrink-0 flex items-center justify-center bg-white border border-gray-200">
                      <img href={`/${brandurl}`} className="text-xs tracking-widest text-gray-700 text-center px-2">
                        {brandName}
                      </img>
                    </div>
                  )}
                </div>

                <div className="w-full mt-5 mb-5">
                  <label
                    htmlFor="gift-message"
                    className="block text-base font-semibold text-gray-800 mb-2"
                  >
                    Message On Gift Card
                  </label>

                  <textarea
                    id="gift-message"
                    rows={4}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Message On Gift Card"
                    className="block w-full min-h-[110px] sm:min-h-[120px] p-3 border border-gray-300 bg-white rounded-sm shadow-sm focus:ring-1 focus:ring-[#c99000] focus:border-[#c99000] outline-none transition-all resize-y text-gray-600 italic"
                  />
                </div>

                <div className="w-full pb-4 border-b border-gray-200 ">
                  <div className="flex items-stretch gap-3">
                    <div className="flex items-center border border-gray-300 bg-white">
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(Math.max(1, Number(e.target.value) || 1))
                        }
                        className="w-14 text-center outline-none py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <div className="flex flex-col border-l border-gray-300">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((currentQty) => currentQty + 1)
                          }
                          className="px-2 hover:bg-gray-100 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((currentQty) =>
                              Math.max(1, currentQty - 1)
                            )
                          }
                          className="px-2 hover:bg-gray-100 border-t border-gray-300 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCartClick}
                      disabled={isAddingToCart || !stock}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#98022e] hover:bg-[#7a0225] text-white font-bold uppercase tracking-wide transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <ShoppingBag size={18} />
                      {isAddingToCart ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 mt-4 text-sm">
                    <button
                      type="button"
                      onClick={handleAddToWishlistClick}
                      className="flex items-center gap-2 text-gray-700 hover:text-[#98022e] transition-colors cursor-pointer"
                    >
                      <Heart size={16} />
                      Add to Wish List
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-2 text-gray-700 hover:text-[#98022e] transition-colors cursor-pointer"
                    >
                      <Repeat size={16} />
                      Compare this Product
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-4">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((starNumber) => (
                      <Star
                        key={starNumber}
                        size={16}
                        className={
                          starNumber <= Math.round(averageRating)
                            ? "fill-[#c99000] text-[#c99000]"
                            : "fill-transparent text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <p
                    onClick={handleWriteReviewClick}
                    className="text-black hover:cursor-pointer hover:text-[#c99000] underline text-sm"
                  >
                    Based on {reviewCount}{" "}
                    {reviewCount === 1 ? "review" : "reviews"}.
                  </p>

                  <span className="text-gray-400">-</span>

                  <p
                    onClick={handleWriteReviewClick}
                    className="text-[#98022e] hover:cursor-pointer hover:underline text-sm font-semibold"
                  >
                    Write a review
                  </p>
                </div>
              </div>

              <div className="w-full bg-[#f8f8f8] border-t border-gray-200 mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-200">
                  <a
                    href="/gift-message-info"
                    className="flex items-center justify-center gap-2 py-4 px-2 text-sm font-semibold text-black hover:text-[#98022e] transition-colors"
                  >
                    <Gift size={18} className="text-[#98022e]" />
                    Free Gift Card
                  </a>

                  <a
                    href="/shipping-delivery"
                    className="flex items-center justify-center gap-2 py-4 px-2 text-sm font-semibold text-black hover:text-[#98022e] transition-colors "
                  >
                    <Truck size={18} className="text-[#98022e]" />
                    Fast Delivery
                  </a>

                  <a
                    download="bulk-order-form.xlsx"
                    href="/bulk-order-form.xlsx"
                    className="flex items-center justify-center gap-2 py-4 px-2 text-sm font-semibold text-black hover:text-[#98022e] transition-colors"
                  >
                    <Download size={18} className="text-[#98022e]" />
                    Bulk Form
                  </a>

                  <a
                    href="/faqs"
                    className="flex items-center justify-center gap-2 py-4 px-2 text-sm font-semibold text-black hover:text-[#98022e] transition-colors"
                  >
                    <HelpCircle size={18} className="text-[#98022e]" />
                    FAQs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
