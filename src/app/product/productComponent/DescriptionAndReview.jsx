"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, X, ChevronDown } from "lucide-react";
import { Sumana } from "next/font/google";

const sumana = Sumana({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const decodeHtml = (str) => {
  if (!str) return "";
  if (typeof window === "undefined") {
    return String(str)
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#39;/g, "'");
  }
  const txt = document.createElement("textarea");
  txt.innerHTML = String(str);
  return txt.value;
};

const MOCK_USER = {
  firstname: "John",
  lastname: "Doe",
};

const SHIPPING_INFO = {
  heading: "Why Choose Our Delivery Service?",
  intro:
    "We make gifting simple, fast, and reliable. Here's why customers trust us:",
  trustPoints: [
    {
      title: "Fast & Reliable Delivery:",
      text: "We work with trusted delivery partners to ensure your wine, champagne, or gift basket arrives safely and on time.",
    },
    {
      title: "Premium Selection:",
      text: "Explore a wide range of fine wines, luxury champagne, prosecco, and gourmet gift baskets from around the world.",
    },
    {
      title: "Easy Ordering & Tracking:",
      text: "Our website offers a smooth shopping experience with secure checkout. Once your order is confirmed, you'll receive tracking details to monitor your delivery in real time.",
    },
  ],
  fallbackNote:
    "If a delivery cannot be completed, we offer flexible solutions:",
  fallbackOptions: [
    {
      title: "Hold at UPS Facility:",
      text: "Request to hold your package at a nearby UPS location for up to one week.",
    },
    {
      title: "Reschedule Delivery:",
      text: "Choose a new delivery date or update the delivery address based on the recipient's availability. You can add your preferred delivery date during checkout in the order comment section, chat with our assistant, or email us directly.",
    },
    {
      title: "Refund or Reship Options:",
      text: "If the package is returned after unsuccessful delivery attempts, you may request a reshipment or receive a refund minus a small handling fee.",
    },
  ],
  detailsHeading: "Shipping & Delivery Details",
};

const ASSISTANCE_BOX = {
  heading: "Need Assistance with Payments or Bulk Orders?",
  textBeforeLink:
    "If you encounter any issues with online payments or wish to place a bulk order, please ",
  linkText: "Download Bulk Order Form",
  linkHref: "/bulk-order-form",
  textBetweenLinkAndEmail: ". Complete the form and send it to ",
  email: "contact@dcwineandspirits.com",
  emailHref: "mailto:contact@dcwineandspirits.com",
  textAfterEmail:
    ". We will promptly provide you with an invoice for convenient payment.",
};

const DescriptionAndReview = ({ product = {} }) => {
  const rawDescription = product.description || "";
  const attributes = Array.isArray(product.attributes) ? product.attributes : [];
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const totalReviews = product.review_count ?? reviews.length;

  // Kis tab me actual data hai — sirf usi tab ka button/section render hoga.
  // Reviews hamesha render hoga (data ho ya na ho), Shipping static content hai
  // (product data pe depend nahi karta) isliye wo bhi hamesha available rahega.
  const hasDescription = Boolean(String(rawDescription).trim());
  const hasSpecifications = attributes.length > 0;

  const TABS = [
    { key: "description", label: "Description", visible: hasDescription },
    { key: "specifications", label: "Specifications", visible: hasSpecifications },
    { key: "shipping", label: "Shipping", visible: true },
    { key: "reviews", label: `Reviews (${totalReviews})`, visible: true },
  ];
  const visibleTabs = TABS.filter((t) => t.visible);

  // ============================================================
  // Desktop tab state — UNCHANGED, wahi purana behaviour.
  // ============================================================
  const [activeTab, setActiveTab] = useState(
    () => visibleTabs[0]?.key || "reviews",
  );

  useEffect(() => {
    if (!visibleTabs.some((t) => t.key === activeTab)) {
      setActiveTab(visibleTabs[0]?.key || "reviews");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDescription, hasSpecifications]);

  // ============================================================
  // NEW: Mobile/Tab accordion state — sab band, sirf "reviews"
  // default open. Ek time pe ek hi panel open (standard accordion).
  // ============================================================
  const [openAccordion, setOpenAccordion] = useState("reviews");

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  const [rating, setRating] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviewSectionRef = useRef(null);
  const fileInputRef = useRef(null);

  const user = MOCK_USER;
  const isUserLoggedIn = Boolean(user);

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (selectedImages.length + newFiles.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }
    setSelectedImages((prevImages) => [...prevImages, ...newFiles]);
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviewUrls]);
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove),
    );
    setPreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating!");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Thank You For Your Review! (this is a fake/mock submit)");
      e.target.reset();
      setRating(0);
      setSelectedImages([]);
      setPreviews([]);
      setIsSubmitting(false);
    }, 600);
  };

  const getTabButtonClass = (tabName) => {
    const isActive = activeTab === tabName;
    return `relative hover:cursor-pointer flex flex-row items-center justify-center h-auto sm:h-[33.75px] pb-[8px] sm:pb-[10px] font-['cambriaregular',Cambria,Georgia,serif] text-[15px] sm:text-[19px] font-bold leading-[23.75px] capitalize whitespace-nowrap transition-all duration-75 ease-out ${
      isActive
        ? "text-[#98022e] border-b-2 border-[#98022e]"
        : "text-gray-500 hover:text-[#98022e]"
    }`;
  };

  // ============================================================
  // NEW: Content renderers — desktop tabs aur mobile accordion
  // dono isi ek function se content lete hain, taaki JSX duplicate
  // na ho.
  // ============================================================
  const renderDescriptionContent = () => (
    <div
      className="product-description-text text-[15px] leading-7 text-zinc-700"
      dangerouslySetInnerHTML={{ __html: decodeHtml(rawDescription) }}
    />
  );

  const renderSpecificationsContent = () => (
    <div className="border border-gray-200 rounded-sm overflow-hidden">
      <table className="w-full text-[15px]">
        <tbody className="divide-y divide-gray-200">
          {attributes.map((attr, i) => (
            <tr key={attr.attribute_id || i} className="odd:bg-white even:bg-[#fafafa]">
              <th className="w-1/3 text-left px-4 py-3 font-semibold text-black align-top">
                {decodeHtml(attr.name)}
              </th>
              <td className="px-4 py-3 text-zinc-700 align-top">
                {decodeHtml(attr.text)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderShippingContent = () => (
    <div className="text-[15px] leading-7 text-zinc-800">
      <p className="mb-4">{SHIPPING_INFO.intro}</p>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        {SHIPPING_INFO.trustPoints.map((point, index) => (
          <li key={index}>
            <span className="font-bold">{point.title}</span> {point.text}
          </li>
        ))}
      </ul>
      <p className="mb-4">{SHIPPING_INFO.fallbackNote}</p>
      <ul className="list-disc pl-6 mb-8 space-y-1">
        {SHIPPING_INFO.fallbackOptions.map((option, index) => (
          <li key={index}>
            <span className="font-bold">{option.title}</span> {option.text}
          </li>
        ))}
      </ul>
      <h2 className={`${sumana.className} text-2xl font-bold text-black`}>
        {SHIPPING_INFO.detailsHeading}
      </h2>
    </div>
  );

  const renderReviewsContent = () => (
    <div>
      {reviews.length > 0 ? (
        <div className="mb-8 flex flex-col gap-0 border border-gray-200">
          {reviews.map((review, index) => (
            <div
              key={review.review_id || index}
              className="p-5 border-b border-gray-200 bg-white last:border-b-0"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-black text-[15px]">
                  {review.author}
                </h3>
                <span className="text-gray-400 text-[13px]">
                  {review.date_added
                    ? new Date(review.date_added).toLocaleDateString("en-GB")
                    : ""}
                </span>
              </div>
              <p className="text-[15px] text-gray-700 mb-3">{review.text}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((starNumber) => (
                  <span
                    key={starNumber}
                    className={
                      starNumber <= (review.rating || 0)
                        ? "text-[#bd8f3a] text-lg"
                        : "text-gray-300 text-lg"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[15px] text-gray-700 mb-5">
          There are no reviews for this product.
        </p>
      )}

      <h2 className="font-['cambriaregular',Cambria,Georgia,serif] text-[19px] font-bold uppercase text-[#bd8f3a] mb-6 mt-6 border-t border-gray-300 pt-6">
        Write a Review
      </h2>

      {!isUserLoggedIn ? (
        <div className="text-[#8a6d3b] mb-10">
          <p className="text-[15px] mb-4">
            Please{" "}
            <a
              href="/login"
              className="font-bold underline hover:text-black transition-colors"
            >
              login
            </a>{" "}
            or{" "}
            <a
              href="/register"
              className="font-bold underline hover:text-black transition-colors"
            >
              register
            </a>{" "}
            to write a review.
          </p>
          <div className="flex gap-4">
            <button className="bg-[#bd8f3a] hover:bg-black text-white px-6 py-2 uppercase font-semibold text-[13px] tracking-wide transition-colors hover:cursor-pointer active:scale-95">
              Login
            </button>
            <button className="border border-[#bd8f3a] text-[#bd8f3a] hover:bg-[#bd8f3a] hover:text-white px-6 py-2 uppercase font-semibold text-[13px] tracking-wide transition-colors hover:cursor-pointer active:scale-95">
              Register
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-[700px]">
          <div className="mb-5">
            <label className="block text-[14px] font-semibold text-black mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="author"
              placeholder="Your Name"
              defaultValue={`${user.firstname} ${user.lastname || ""}`.trim()}
              required
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-[#bd8f3a] text-[15px] bg-white"
            />
          </div>

          <div className="mb-3">
            <label className="block text-[14px] font-semibold text-black mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              name="text"
              rows={6}
              placeholder="Write your review..."
              required
              className="w-full border border-gray-300 px-4 py-3 outline-none resize-none focus:border-[#bd8f3a] text-[15px] bg-white"
            />
          </div>

          <p className="text-[14px] text-gray-500 mb-6">
            <span className="text-red-500 font-semibold">Note:</span> HTML is
            not translated!
          </p>

          <div className="mb-8">
            <label className="block text-[14px] font-semibold text-black mb-2">
              Image
            </label>

            <div
              onClick={() => fileInputRef.current.click()}
              className="w-full border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Upload size={24} className="text-black" />
              <p className="text-[15px] font-medium text-black">
                Choose a file{" "}
                <span className="font-normal text-gray-500">
                  or drag it here.
                </span>
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>

            {previews.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {previews.map((previewUrl, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 border border-gray-200 rounded-sm overflow-hidden"
                  >
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <label className="block text-[14px] font-semibold text-black mb-3">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <span className="text-[15px] text-black">Bad</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <input
                    key={starValue}
                    type="radio"
                    name="rating"
                    value={starValue}
                    checked={rating === starValue}
                    onChange={() => setRating(starValue)}
                    required
                    className="w-4 h-4 accent-[#bd8f3a] cursor-pointer"
                  />
                ))}
              </div>
              <span className="text-[15px] text-black">Good</span>
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-200 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#f5f5f5] hover:bg-black hover:text-white transition-all text-black px-8 py-3 uppercase font-semibold text-[14px] tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? "Submitting..." : "Continue"}
              {!isSubmitting && <span>→</span>}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  const getAccordionContent = (key) => {
    switch (key) {
      case "description":
        return hasDescription ? renderDescriptionContent() : null;
      case "specifications":
        return hasSpecifications ? renderSpecificationsContent() : null;
      case "shipping":
        return renderShippingContent();
      case "reviews":
        return renderReviewsContent();
      default:
        return null;
    }
  };

  return (
    <main className="px-3 2xl:px-32 py-3">
      {/* ============================================================
          DESKTOP — UNCHANGED, purana tabs behaviour "lg" aur upar
      ============================================================ */}
      <div className="hidden lg:block">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-6 border-y border-gray-200 justify-center pt-4 font-sumana">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={getTabButtonClass(tab.key)}
            >
              <span className="font-sumana uppercase"> {tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "description" && hasDescription && (
          <section className="py-4 mt-1 px-2 lg:px-0">
            {renderDescriptionContent()}
          </section>
        )}

        {activeTab === "specifications" && hasSpecifications && (
          <section className="py-6 mt-1">
            <h2
              className={`${sumana.className} text-2xl font-bold text-black mb-4`}
            >
              Specifications
            </h2>
            {renderSpecificationsContent()}
          </section>
        )}

        {activeTab === "shipping" && (
          <section className="py-6 mt-1">
            <h2 className={`${sumana.className} text-xl lg:text-2xl font-bold text-black mb-4 font-hind-madurai`}>
              {SHIPPING_INFO.heading}
            </h2>
            {renderShippingContent()}
          </section>
        )}

        {activeTab === "reviews" && (
          <section
            id="product-review-section"
            ref={reviewSectionRef}
            className="py-4 mt-1"
          >
            {renderReviewsContent()}
          </section>
        )}
      </div>

      {/* ============================================================
          NEW: MOBILE/TAB — accordion, sirf "lg" se neeche dikhega.
          Order: Description, Specifications, Shipping, Reviews
          (visibleTabs already isi order me hai). Sab band, sirf
          "reviews" default open.
      ============================================================ */}
      <div className="lg:hidden">
        {visibleTabs.map((tab) => {
          const isOpen = openAccordion === tab.key;
          return (
            <div key={tab.key} className="border-b border-gray-200">
              <button
                type="button"
                onClick={() => toggleAccordion(tab.key)}
                className="w-full flex items-center justify-between py-4 text-left cursor-pointer"
                aria-expanded={isOpen}
              >
                <span
                  className={`font-sumana uppercase text-[15px] font-bold tracking-wide ${
                    isOpen ? "text-[#98022e]" : "text-black"
                  }`}
                >
                  {tab.label}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? "rotate-180 text-[#98022e]" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[10000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div
                  id={tab.key === "reviews" ? "product-review-section-mobile" : undefined}
                  className="pb-5 px-1"
                >
                  {getAccordionContent(tab.key)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#f8f8f8] mt-6 py-8 px-6 text-center">
        <h3 className="text-lg font-bold text-black mb-4">{ASSISTANCE_BOX.heading}</h3>
        <p className="max-w-3xl mx-auto">
          {ASSISTANCE_BOX.textBeforeLink}
          <a
            href={ASSISTANCE_BOX.linkHref}
            className="text-[#98022e] hover:underline"
          >
            {ASSISTANCE_BOX.linkText}
          </a>
          {ASSISTANCE_BOX.textBetweenLinkAndEmail}
          <a
            href={ASSISTANCE_BOX.emailHref}
            className="text-[#98022e] hover:underline"
          >
            {ASSISTANCE_BOX.email}
          </a>
          {ASSISTANCE_BOX.textAfterEmail}
        </p>
      </div>

      <style jsx global>{`
        .product-description-text h2 {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 1.5rem;
          margin-bottom: 0.6rem;
        }
        .product-description-text h3 {
          font-size: 17px;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .product-description-text p {
          margin-bottom: 0.85rem;
        }
        .product-description-text ul,
        .product-description-text ol {
          margin: 0.9rem 0 0.9rem 1.5rem;
          list-style: disc;
        }
        .product-description-text ol {
          list-style: decimal;
        }
        .product-description-text li {
          margin-bottom: 0.35rem;
        }
        .product-description-text img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 0.8rem 0;
        }
        .product-description-text blockquote {
          border-left: 3px solid #98022e;
          padding: 0.5rem 1rem;
          background: #faf5f6;
          margin: 1rem 0;
          font-style: italic;
          color: #555;
        }
        .product-description-text a {
          color: #98022e;
          text-decoration: underline;
        }
        .product-description-text strong,
        .product-description-text b {
          font-weight: 700;
        }
      `}</style>
    </main>
  );
};

export default DescriptionAndReview;