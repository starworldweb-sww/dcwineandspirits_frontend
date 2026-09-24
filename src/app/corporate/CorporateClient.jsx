"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";

import {
  FiGift,
  FiUsers,
  FiTruck,
  FiShield,
  FiDownload,
  FiSend,
} from "react-icons/fi";
import BulkSubmitPopUp from "./corporateComponent/BulkSumbitPopUp";
import CorporateReasons from "./corporateComponent/CorporateReasons";
import LaptopComponent from "./corporateComponent/LaptopComponent";
import EngravedBottles from "./corporateComponent/EngravedBottles";
import BulkOrderSteps from "./corporateComponent/BulkOrderSteps";

const PRODUCT_TABS = ["Gift Baskets", "Wine", "Champagne"];

const PRODUCTS = {
  "Gift Baskets": [
    {
      id: "WCG055",
      name: "Bon Appetit Gourmet Gift Basket",
      slug: "bon-appetit-gourmet-gift-basket",
      image: "/images/corporate/bon-appetit-gourmet-gift-basket.webp",
    },
    {
      id: "WCG054",
      name: "Congratulation Gift Basket",
      slug: "congratulation-gift-basket",
      image: "/images/corporate/congratulation-gift-basket.webp",
    },
    {
      id: "WCG051",
      name: "Godiva Chocolate Holiday Gift Basket",
      slug: "godiva-chocolate-holiday-gift-basket",
      image: "/images/corporate/godiva-chocolate-holiday-gift-basket.webp",
    },
    {
      id: "WCG057",
      name: "The Connoisseur Gift Basket",
      slug: "the-connoisseur-gift-basket",
      image: "/images/corporate/the-connoisseur-gift-basket.webp",
    },
    {
      id: "WCG052",
      name: "The Gourmet Delight Gift Basket",
      slug: "the-gourmet-delight-gift-basket",
      image: "/images/corporate/the-gourmet-delight-gift-basket.webp",
    },
    {
      id: "WCG206",
      name: "Godiva Chocolates 8 Pc Box",
      slug: "godiva-chocolates-8-pc-box",
      image: "/images/corporate/godiva-chocolates-8-pc-box.webp",
    },
    {
      id: "WCG085",
      name: "Godiva Chocolate Basket & Mug",
      slug: "godiva-chocolate-basket-mug",
      image: "/images/corporate/godiva-chocolate-basket-mug.webp",
    },
    {
      id: "WCG402",
      name: "Godiva Black & Gold Celebration Gift Basket",
      slug: "godiva-black-gold-celebration-gift-basket",
      image: "/images/corporate/godiva-black-gold-celebration-gift-basket.webp",
    },
    {
      id: "WCG013",
      name: "Godiva Chocolates 26 Pc Box",
      slug: "godiva-chocolates-26-pc-box",
      image: "/images/corporate/godiva-chocolates-26-pc-box.webp",
    },
    {
      id: "WCG002",
      name: "Veuve Clicquot Rose & Assorted Godiva Chocolates Gift Basket",
      slug: "veuve-clicquot-rose-godiva-chocolates-gift-basket",
      image:
        "/images/corporate/veuve-clicquot-rose-godiva-chocolates-gift-basket.webp",
    },
    {
      id: "WCG---",
      name: "Italy Gift Basket",
      slug: "italy-gift-basket",
      image: "/images/corporate/italy-gift-basket.webp",
    },
    {
      id: "WCG009",
      name: "Caymus Wine & Cheese Gift Basket",
      slug: "caymus-wine-cheese-gift-basket",
      image: "/images/corporate/caymus-wine-cheese-gift-basket.webp",
    },
    {
      id: "WCG015",
      name: "Caymus Cabernet Sauvignon Wine Gift Basket",
      slug: "caymus-cabernet-sauvignon-wine-gift-basket",
      image:
        "/images/corporate/caymus-cabernet-sauvignon-wine-gift-basket.webp",
    },
    {
      id: "WCG364",
      name: "Cakebread Wine Gift Set",
      slug: "cakebread-wine-gift-set",
      image: "/images/corporate/cakebread-wine-gift-set.webp",
    },
    {
      id: "WCG182",
      name: "DAOU Soul of a Lion Wine & Cheese Gift Basket",
      slug: "daou-soul-of-a-lion-wine-cheese-gift-basket",
      image:
        "/images/corporate/daou-soul-of-a-lion-wine-cheese-gift-basket.webp",
    },
  ],
  Wine: [],
  Champagne: [],
};

const COMMITMENT_ITEMS = [
  { label: "Personalization", icon: "✉️" },
  { label: "Employee Appreciation", icon: "🎉" },
  { label: "Client Gifting", icon: "🎁" },
  { label: "All Occasions", icon: "🎀" },
  { label: "Contact Us", icon: "📞" },
];

const PRICE_TIERS = [
  {
    label: "Gifts Under",
    amount: "$49",
    href: "/gifts-under-49",
    bg: "from-purple-900 via-purple-800 to-fuchsia-700",
  },
  {
    label: "Gifts Under",
    amount: "$99",
    href: "/gifts-under-99",
    bg: "from-rose-900 via-pink-700 to-rose-500",
  },
  {
    label: "Gifts Under",
    amount: "$199",
    href: "/gifts-100-to-199/",
    bg: "from-indigo-900 via-violet-800 to-purple-600",
  },
];

const BRANDS = [
  { name: "Veuve Clicquot", slug: "veuve-clicquot" },
  { name: "Dom Perignon", slug: "dom-perignon" },
  { name: "Caymus Vineyards", slug: "caymus-vineyards" },
  { name: "Meiomi", slug: "meiomi" },
  { name: "Duckhorn Vineyards", slug: "duckhorn-vineyards" },
  { name: "Godiva Chocolatier", slug: "godiva" },
  { name: "Billecart-Salmon", slug: "billecart-salmon" },
  { name: "Moet & Chandon", slug: "moet-chandon" },
];

// Key Features grid data — same pattern as Amazon Business "Key Features" section
const KEY_FEATURES = [
  { label: "Bulk Discounts", icon: "📦" },
  { label: "Business Analytics", icon: "📊" },
  { label: "Compliance Tools", icon: "📋" },
  { label: "Bulk Purchasing", icon: "🛒" },
  { label: "Business PAN", icon: "💳" },
  { label: "Shipping & Delivery", icon: "🚚" },
  { label: "Payment Methods", icon: "💰" },
  { label: "Account Security", icon: "🔒" },
  { label: "GST Invoice", icon: "🧾" },
  { label: "Mobile App", icon: "📱" },
];

// --- BRAND ACCENT (DC Wine & Spirits) ---
const ACCENT = "#98022e";

const breadcrumbs = [{ label: "Corporate Bulk Order", href: "/corporate" }];

function FeatureCard({ icon, title, children, dark }) {
  return (
    <div
      className={`p-9 px-5 text-center font-hind-madurai ${
        dark ? "bg-[#1c1f22] text-white" : "bg-[#f6f6f6] text-[#333333]"
      }`}
    >
      <div
        className="w-16 h-16 rounded-full border-2 flex items-center justify-center mx-auto mb-4 text-2xl"
        style={{ borderColor: ACCENT }}
      >
        {icon}
      </div>
      <h4 className="text-base font-bold mb-2">{title}</h4>
      {children}
    </div>
  );
}

export default function CorporateClient() {
  const [activeTab, setActiveTab] = useState("Gift Baskets");
  const [showBulkPopup, setShowBulkPopup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No API — form is UI only for now
  };

  const activeProducts = PRODUCTS[activeTab] || [];

  return (
    <main className="font-['cambriaregular'] text-[#333333]">
      {/* Page header / breadcrumb — same pattern as account pages */}
      <ProductsHeader
        categoryName="Corporate Bulk Order"
        breadcrumbs={breadcrumbs}
      />

      <section className="relative min-h-[320px] md:min-h-[440px] flex items-center overflow-hidden bg-white">
        <Image
          src="/corporate/finalmainbanner.png"
          alt="Corporate Gifting"
          fill
          priority
          className="object-contain object-center md:object-right"
        />
        <div className="relative z-10 px-6 md:px-16 py-10 max-w-[600px] font-hind-madurai text-left">
          <h2
            className="text-2xl md:text-[38px] font-bold leading-tight mb-3"
            style={{ fontFamily: "'cambriaregular', Georgia, serif" }}
          >
            <span className="text-[#1c1f22]">Corporate &amp;</span>
            <br />
            <span style={{ color: ACCENT }}>Bulk Gift Orders</span>
          </h2>

          <p className="text-sm md:text-base max-w-[480px] text-[#666] mb-6">
            Curated wine, champagne &amp; gourmet gift baskets to celebrate your
            team, clients &amp; partners.
          </p>

          {/* Feature icons row */}
          <div className="grid grid-cols-4 gap-3 mb-7 max-w-[440px]">
            {[
              { Icon: FiGift, label: "Personalized Gifting" },
              { Icon: FiUsers, label: "For Teams & Clients" },
              { Icon: FiTruck, label: "Same Day Delivery" },
              { Icon: FiShield, label: "Trusted Quality" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center gap-1.5"
              >
                <div
                  className="w-10 h-10 rounded-full border flex items-center justify-center"
                  style={{ borderColor: ACCENT, color: ACCENT }}
                >
                  <item.Icon size={18} />
                </div>
                <span className="text-[10px] md:text-[11px] leading-tight text-[#444]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-nowrap gap-3 sm:gap-4">
            <a
              href="/bulk-order-form.xlsx"
              download={"bulk_order_form.xlsx"}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-white px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm tracking-wide no-underline transition-colors"
              style={{ backgroundColor: ACCENT }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#7e1a3c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = ACCENT)
              }
            >
              <FiDownload size={15} />
              Download Bulk Order Form
            </a>
            <button
              type="button"
              onClick={() => setShowBulkPopup(true)}
              className="inline-flex text-white border-0 items-center justify-center gap-2 whitespace-nowrap px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm tracking-wide transition-colors cursor-pointer bg-[#98022e]"
            >
              <FiSend size={14} />
              Submit Bulk Order Form
            </button>
          </div>
        </div>
      </section>
      {/* Hero */}
      <section className="relative min-h-[280px] md:min-h-[360px] flex items-center py-10 px-4 overflow-hidden">
        <Image
          src="/coprate_page_banner_main.webp"
          alt=""
          fill
          priority
          className="object-cover -z-10"
        />
        <div className="absolute inset-0 bg-[#1c1f22]/55 -z-10" />
        <div className="max-w-[700px] mx-auto bg-white/95 px-6 py-8 md:px-10 md:py-9 text-center rounded-sm">
          <h2 className="text-2xl md:text-[30px] font-bold mb-3 font-hind-madurai">
            Corporate Gift Baskets
          </h2>
          <p className="text-sm text-[#555] mb-5 leading-relaxed font-hind-madurai">
            Keep your office space boosted with tokens of appreciation and
            acknowledgement.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 text-sm mb-5 font-hind-madurai">
            <span>✉ contact@dcwineandspirits.com</span>
            <span>📞 (202) 459-8489</span>
          </div>
          <a
            href="/bulk-order-form.xlsx"
            download={"bulk_order_form.xlsx"}
            className="inline-block text-white px-7 py-3 font-semibold text-sm tracking-wide no-underline transition-colors font-hind-madurai"
            style={{ backgroundColor: ACCENT }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#7e1a3c")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = ACCENT)
            }
          >
            Download Our Bulk Order Form
          </a>
        </div>
      </section>

      {/* keys */}

      {/* Key Features */}
  

      {/* */}
      <CorporateReasons />
      
      <LaptopComponent />

      {/* Bottles + Lead form */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-5 -mt-8 md:-mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 shadow-lg">
          <div className="relative bg-[#eeeeee] min-h-[260px] md:min-h-[320px]"></div>

          <div className="bg-white px-6 py-8 md:px-10 md:py-8">
            <h3 className="text-xl font-bold text-center mb-1.5 font-hind-madurai">
              Let&apos;s Get Started
            </h3>
            <p className="text-xs text-center text-[#777] mb-4 leading-relaxed font-hind-madurai">
              Please enter your contact information in the fields below and we
              will be in touch within 24 hours.
            </p>
            <hr className="border-t border-[#e5e5e5] mb-5" />

            <form
              onSubmit={handleSubmit}
              className="space-y-4 font-hind-madurai"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-[#d9d9d9] rounded-[3px] outline-none focus:border-[#98022e] focus:ring-1 focus:ring-[#98022e]/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-[#d9d9d9] rounded-[3px] outline-none focus:border-[#98022e] focus:ring-1 focus:ring-[#98022e]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1.5">
                    Your Email ID
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-[#d9d9d9] rounded-[3px] outline-none focus:border-[#98022e] focus:ring-1 focus:ring-[#98022e]/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5">
                    Your Phone No.
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-[#d9d9d9] rounded-[3px] outline-none focus:border-[#98022e] focus:ring-1 focus:ring-[#98022e]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm border border-[#d9d9d9] rounded-[3px] resize-y outline-none focus:border-[#98022e] focus:ring-1 focus:ring-[#98022e]/30"
                />
              </div>

              <button
                type="submit"
                className="w-full text-white py-3.5 font-semibold text-sm tracking-wide transition-colors cursor-pointer"
                style={{ backgroundColor: ACCENT }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#7e1a3c")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = ACCENT)
                }
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>


      <BulkSubmitPopUp
        open={showBulkPopup}
        onClose={() => setShowBulkPopup(false)}
      />
    </main>
  );
}
