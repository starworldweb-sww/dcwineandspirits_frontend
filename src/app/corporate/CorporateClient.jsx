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
import HowToBulkOrder from "./corporateComponent/HowToBulkOrder";
import CorporateProducts from "./corporateComponent/CorporateProducts";
import BrandsClient from "../brands/BrandsClient";
import CorporateBrands from "./corporateComponent/CorporateBrands";
import CategoryShowcase from "../components/categoryShowcase/CategoryShowcase";
import CorporateCategories from "./corporateComponent/CorporateCategories";
import CorporateNow from "./corporateComponent/CorporateNow";
import CorporateSupport from "./corporateComponent/CorporateSupport";
import CorporateContactForm from "./corporateComponent/CorporateContactForm";
import BulkOrderForm from "./corporateComponent/BulkOrderForm";
import CorporateBulkOrderOnPage from "./corporateComponent/CorporateBulkOrderOnPage";

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

 {/* Mobile: stacked | Desktop: banner image as background */}
<section className="relative flex flex-col md:flex-row md:items-center md:min-h-[440px] overflow-hidden bg-white">
  {/* Image wrapper: normal block on mobile, absolute background on desktop */}
  <div className="relative w-full h-[220px] md:absolute md:inset-0 md:h-full">
    <Image
      src="/corporate/finalmainbanner.png"
      alt="Corporate Gifting"
      fill
      priority
      sizes="100vw"
      className="object-contain object-center md:object-right"
    />

    {/* Left side white gradient (desktop only) */}
    <div
      className="hidden md:block absolute inset-y-0 left-0 w-[80%] pointer-events-none"
      style={{
        background:
          "linear-gradient(to right, #ffffff 0%, #ffffff 35%, rgba(255,255,255,0.85) 55%, rgba(255,255,255,0) 100%)",
      }}
    />
  </div>

  <div className="relative z-10 w-full px-4 sm:px-6 2xl:px-32 py-6 md:py-10 md:max-w-[600px] font-hind-madurai text-center md:text-left">
    <h2
      className="text-2xl md:text-[38px] font-bold leading-tight mb-3"
      style={{ fontFamily: "'cambriaregular', Georgia, serif" }}
    >
      <span className="text-[#1c1f22]">Corporate &amp;</span>
      <br />
      <span style={{ color: ACCENT }}>Bulk Gift Orders</span>
    </h2>

    <p className="text-sm md:text-base max-w-[480px] mx-auto md:mx-0 text-[#666] mb-6">
      Curated wine, champagne &amp; gourmet gift baskets to celebrate your
      team, clients &amp; partners.
    </p>

    {/* Offer box (replaces the feature icons) */}
    <div
      className="mb-7 mx-auto md:mx-0 inline-block max-w-[440px] rounded-md border border-dashed px-5 py-3 text-center md:text-left"
      style={{ borderColor: ACCENT }}
    >
      <p className="text-lg md:text-2xl font-bold leading-tight text-[#1c1f22]">
        Up to <span style={{ color: ACCENT }}>15% off</span> on bulk orders
      </p>
      <p className="mt-1 text-xs md:text-sm uppercase tracking-widest text-[#98022e]">
        Valid until 31st Oct
      </p>
    </div>

    <div className="flex flex-col sm:flex-row sm:flex-nowrap gap-3 sm:gap-4">
      <a
        href="/bulk-order-form.xlsx"
        download={"bulk_order_form.xlsx"}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 whitespace-nowrap text-white px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm tracking-wide no-underline transition-colors"
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
        className="inline-flex w-full sm:w-auto text-black border-0 items-center justify-center gap-2 whitespace-nowrap px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm tracking-wide transition-colors cursor-pointer bg-[#d1d1d1]"
      >
        <FiSend size={14} />
        Submit Bulk Order Form
      </button>
    </div>
  </div>
</section>
<CorporateBulkOrderOnPage/>
{/* <BulkOrderForm/>       */}
<CorporateProducts/>
<HowToBulkOrder/>
<CorporateReasons />
<CorporateBrands/>
<CorporateCategories/>
<LaptopComponent />
<EngravedBottles/>
<CorporateSupport/>
<CorporateNow/>
<CorporateContactForm/>
<BulkSubmitPopUp
open={showBulkPopup}
onClose={() => setShowBulkPopup(false)}/>



    </main>
  );
}
