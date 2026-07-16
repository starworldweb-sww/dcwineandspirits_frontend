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
import DescriptionAndReview from "./DescriptionAndReview";
import RecommendedProducts from "./RecommendedProducts";

// -----------------------------------------------------------------
// FONTS
// Sumana font -> sirf price aur "Message On Gift Card" heading ke liye
// Hind Madurai font -> baaki poore page ka normal text
// -----------------------------------------------------------------
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

// -----------------------------------------------------------------
// STEP 1: MOCK PRODUCT DATA
// -----------------------------------------------------------------
const product = {
  name: "Billecart-Salmon Champagne & Silver Oak Cabernet Gift Set",
  model: "WDG186",
  sku: "VC00514",
  upc: "8175305020",
  brandName: "Veuve Clicquot",
  quantity: 12,
  original_price: "249.00",
  special_price: null,
  image:
    "https://www.dcwineandspirits.com/image/cache/catalog/champagne/billecart-salmon-silver-oak-wedding-set-sparkling-rhinestones-1100x1100.webp",
  images: [
    "/images/products/billecart-salmon-gift-set-1.jpg",
    "/images/products/billecart-salmon-gift-set-2.jpg",
    "/images/products/billecart-salmon-gift-set-3.jpg",
  ],
  product_review: [{ rating: 5 }],

  // ---------------------------------------------------------------
  // MOCK DATA FOR DescriptionAndReview COMPONENT
  // description -> Description tab me dikhega (HTML string, decode hoga)
  // reviews -> Reviews tab me dikhega
  // ---------------------------------------------------------------
  id: "WDG186",
  description:
    "<p>This exquisite gift set pairs a bottle of Billecart-Salmon Champagne with a bottle of Silver Oak Cabernet Sauvignon, presented together in an elegant sparkling rhinestone-accented box. Perfect for weddings, anniversaries, or any celebration that calls for both bubbles and bold red wine.</p><p>Each bottle is carefully selected to represent the finest in its category, making this a memorable gift for wine and champagne lovers alike.</p>",
  reviews: {
    total: 1,
    items: [
      {
        author: "John D.",
        date: "2026-06-01",
        text: "Amazing gift set! Both bottles were excellent and the packaging was beautiful.",
        rating: 5,
        images: [],
      },
    ],
  },
};

export default function Page() {
  // -----------------------------------------------------------------
  // STEP 2: PAGE KA STATE
  // -----------------------------------------------------------------
  const [stock] = useState(product.quantity > 0);
  const [mainImage, setMainImage] = useState(product.image);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("center center");
  const [giftMessage, setGiftMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // -----------------------------------------------------------------
  // STEP 3: DERIVED VALUES
  // -----------------------------------------------------------------
  const reviews = product.product_review || [];
  const reviewCount = reviews.length;

  const averageRating =
    reviewCount > 0
      ? reviews.reduce((total, review) => total + Number(review.rating), 0) /
        reviewCount
      : 0;

  const allImages = product.images?.length
    ? [product.image, ...product.images]
    : [product.image];

  const hasSpecialPrice =
    product.special_price !== null &&
    product.special_price !== undefined &&
    product.special_price !== "";

  // -----------------------------------------------------------------
  // STEP 4: EVENT HANDLERS
  // -----------------------------------------------------------------
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

  const handleAddToCartClick = () => {
    setIsAddingToCart(true);
    console.log("Add to cart:", { quantity, giftMessage });
    setTimeout(() => setIsAddingToCart(false), 800);
  };

  const handleAddToWishlistClick = () => {
    console.log("Add to wishlist");
  };

  const handleWriteReviewClick = () => {
    console.log("Write a review clicked");
  };

  // -----------------------------------------------------------------
  // STEP 5: PAGE KA UI (JSX)
  // -----------------------------------------------------------------
  return (
    <>
      <ProductsHeader />
      <main className={`min-h-screen w-full bg-white ${hindMadurai.className}`}>
        <section className="bg-white px-3 2xl:px-32 py-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* =============================================================
              LEFT COLUMN: PRODUCT IMAGES
          ============================================================= */}
            <div className="w-full lg:w-auto flex flex-row gap-3 lg:gap-4">
              {/* Thumbnails - sirf tab dikhte hain jab 1 se zyada image ho */}
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

              {/* Main image box - fixed 486x486px on lg screens.
                NOTE: ye 486px sirf image ki apni height hai. Right side
                wale info card ki height isi 486px se match karti hai,
                lekin perk bar (neeche wali strip) is calculation me
                shaamil NAHI hai - wo apni khud ki natural height leta hai. */}
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

            {/* =============================================================
              RIGHT COLUMN: PRODUCT INFO
              NOTE: outer wrapper pe koi fixed height nahi hai.
              Sirf andar wala light-gray info card (price se lekar
              reviews tak) 486px height ka hai aur agar content zyada
              lamba ho jaye toh andar hi scroll hoga (overflow-y-auto).
              Perk bar iske bahar hai - apni natural height leta hai,
              486px ke calculation me count nahi hota.
          ============================================================= */}
            <div className="w-full lg:w-1/2 min-w-0 flex flex-col justify-between">
              <div className="bg-[#f8f8f8] p-5 sm:p-6 lg:h-[486px] lg:overflow-y-auto">
                {/* --- Price | divider | Stock/Model/SKU/UPC | Brand logo --- */}
                <div className="flex items-stretch justify-between gap-4 pb-4 border-b border-gray-200">
                  <div className="flex items-stretch gap-4">
                    {/* Price */}
                    <div
                      className={`${sumana.className} flex flex-col justify-center`}
                    >
                      {hasSpecialPrice ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-lg text-gray-400 line-through">
                            ${Number(product.original_price).toFixed(2)}
                          </span>
                          <h1 className="font-bold text-2xl lg:text-3xl text-black">
                            ${Number(product.special_price).toFixed(2)}
                          </h1>
                        </div>
                      ) : (
                        <h1 className="font-bold text-2xl lg:text-3xl text-black">
                          ${Number(product.original_price).toFixed(2)}
                        </h1>
                      )}
                    </div>

                    {/* Vertical divider line */}
                    <div className="w-px bg-gray-300" />

                    {/* Stock status + Model/SKU/UPC list */}
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

                  {/* Brand logo box */}
                  {product.brandName && (
                    <div className="w-[120px] h-[60px] flex-shrink-0 flex items-center justify-center bg-white border border-gray-200">
                      <span className="text-xs tracking-widest text-gray-700 text-center px-2">
                        {product.brandName}
                      </span>
                    </div>
                  )}
                </div>

                {/* --- Gift message textarea --- */}
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

                {/* --- Quantity selector + Add To Cart button --- */}
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
                              Math.max(1, currentQty - 1),
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

                {/* --- Star rating + review count --- */}
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

              {/* =========================================================
                BOTTOM PERK BAR
                NOTE: Ye 486px calculation ke bahar hai - apni khud ki
                natural height leta hai, upar wale info card se totally
                independent.
            ========================================================= */}
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
