"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";

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
      image: "/images/corporate/veuve-clicquot-rose-godiva-chocolates-gift-basket.webp",
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
      image: "/images/corporate/caymus-cabernet-sauvignon-wine-gift-basket.webp",
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
      image: "/images/corporate/daou-soul-of-a-lion-wine-cheese-gift-basket.webp",
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
      <ProductsHeader categoryName="Corporate Bulk Order" breadcrumbs={breadcrumbs} />

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
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7e1a3c")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
          >
            Download Our Bulk Order Form
          </a>
        </div>
      </section>

      {/* Bottles + Lead form */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-5 -mt-8 md:-mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 shadow-lg">
          <div className="relative bg-[#eeeeee] min-h-[260px] md:min-h-[320px]">
            <Image
              src=""
              alt="Featured corporate gifting bottles"
              fill
              className="object-cover"
            />
          </div>

          <div className="bg-white px-6 py-8 md:px-10 md:py-8">
            <h3 className="text-xl font-bold text-center mb-1.5 font-hind-madurai">
              Let&apos;s Get Started
            </h3>
            <p className="text-xs text-center text-[#777] mb-4 leading-relaxed font-hind-madurai">
              Please enter your contact information in the fields below and
              we will be in touch within 24 hours.
            </p>
            <hr className="border-t border-[#e5e5e5] mb-5" />

            <form onSubmit={handleSubmit} className="space-y-4 font-hind-madurai">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-[#d9d9d9] rounded-[3px] outline-none focus:border-[#98022e] focus:ring-1 focus:ring-[#98022e]/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5">Business Name</label>
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
                  <label className="text-xs font-semibold block mb-1.5">Your Email ID</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-[#d9d9d9] rounded-[3px] outline-none focus:border-[#98022e] focus:ring-1 focus:ring-[#98022e]/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5">Your Phone No.</label>
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
                <label className="text-xs font-semibold block mb-1.5">Message</label>
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
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7e1a3c")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* We Make Corporate Gifting Easy */}
      <section className="max-w-[1100px] mx-auto px-5 mt-16 md:mt-[70px] text-center font-hind-madurai">
        <h2 className="text-xl md:text-2xl font-bold mb-3.5">We Make Corporate Gifting Easy</h2>
        <p className="text-sm text-[#666] leading-relaxed max-w-[760px] mx-auto">
          Gift-giving isn&apos;t a rule, but it&apos;s a way to celebrate
          performances, upscales, events, and networking in the office. So
          come, charge up your office space with tokens of appreciation and
          celebration.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-10">
          <FeatureCard icon="🛍️" title="Shop With Full Zeal">
            <p className="text-[13px] text-[#777] leading-relaxed">
              Discover an extensive selection of wine and spirits gifts,
              paired with high-quality cheese, chocolates, and snacks.
            </p>
          </FeatureCard>
          <FeatureCard icon="🎛️" title="Personalize & Customize">
            <p className="text-[13px] text-[#777] leading-relaxed">
              Deliver and handover gifts, selected with a sense of
              thoughtfulness and understanding of the recipients.
            </p>
          </FeatureCard>
          <FeatureCard icon="🤝" title="Build Relationships">
            <p className="text-[13px] text-[#777] leading-relaxed">
              Instill values by giving gifts that represent gratitude,
              appreciation, and celebration.
            </p>
          </FeatureCard>
          <FeatureCard icon="📞" title="Helpful Links" dark>
            <p className="text-[13px] text-gray-300 mb-2.5">Active links for your assistance</p>
            <p className="text-2xl font-bold mb-1" style={{ color: ACCENT }}>
              24x7
            </p>
            <a
              href="tel:+12024598489"
              className="text-[13px] hover:underline"
              style={{ color: ACCENT }}
            >
              Call Now (202) 459-8489
            </a>
          </FeatureCard>
        </div>
      </section>

      {/* Your Gift-Giving is Our Commitment */}
      {/* <section className="bg-[#f4f4f4] mt-16 md:mt-[70px] py-12 md:py-[60px] px-5 font-hind-madurai">
        <div className="max-w-[1100px] mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3.5">Your Gift-Giving is Our Commitment.</h2>
          <p className="text-sm text-[#666] leading-relaxed max-w-[820px] mx-auto mb-10">
            DC Wine and Spirits has been tying together relationships
            for a long time, with impressive gifts that are unrivalled in
            quality. We recognise the value of gratitude and appreciation in
            your workspace. So, there are gifts for all of your current and
            future customers, clients, coworkers, and other business
            partners.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {COMMITMENT_ITEMS.map((item) => (
              <Link
                key={item.label}
                href="#"
                className="text-white py-9 px-4 no-underline flex flex-col items-center gap-3.5 text-sm font-semibold transition-colors"
                style={{ backgroundColor: ACCENT }}
              >
                <span className="text-2xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* Pair Any Wine or Spirit */}
      <section className="max-w-[1200px] mx-auto px-5 mt-16 md:mt-[70px] text-center font-hind-madurai">
        <h2 className="text-xl md:text-2xl font-bold mb-3.5">
          Pair Any Wine or Spirit with Any of Your Favourite Gift Basket.
        </h2>
        <p className="text-sm text-[#666] leading-relaxed max-w-[760px] mx-auto mb-7">
          To make gift-giving more personal, we also offer the option to
          pair any wine or spirit with any gift basket of your choice. So,
          craft impressive assortments and place your orders right away!
        </p>

        {/* Tabs */}
        {/* <div className="flex justify-center flex-wrap mb-9">
          {PRODUCT_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-7 py-2.5 text-sm font-semibold cursor-pointer border -ml-px first:ml-0 transition-colors ${
                activeTab === tab ? "text-white" : "bg-white text-[#333333]"
              }`}
              style={{
                borderColor: ACCENT,
                backgroundColor: activeTab === tab ? ACCENT : "white",
              }}
            >
              {tab}
            </button>
          ))}
        </div> */}

        {/* Product grid */}
        {/* {activeProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 text-left">
            {activeProducts.map((product) => (
              <Link
                key={product.id}
                href={`/${product.slug}/`}
                className="text-[#333333] no-underline group"
              >
                <div className="aspect-square bg-[#f6f6f6] flex items-center justify-center mb-2.5 overflow-hidden">
                  <div className="relative w-[90%] h-[90%]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#999] mb-1">{product.id}</p>
                <p className="text-[13px] leading-snug m-0">{product.name}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#999] py-10">No products available in this category yet.</p>
        )} */}
      </section>

      {/* Bulk Order / Small Order */}
      <section className="mt-16 md:mt-[70px] py-12 md:py-[60px] px-5 bg-[#333333]/[0.04] font-hind-madurai">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-1">Bulk Order</h3>
            <p className="text-xs text-[#777] mb-4">5 recipients or more</p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:2024598489"
                className="border px-5 py-3 text-[13px] font-semibold no-underline transition-colors"
                style={{ borderColor: "#333333", color: "#333333" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#333333";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#333333";
                }}
              >
                📞 Call us today (202) 459-8489
              </a>
              <a
                href="/bulk-order-form.xlsx"
                download={"bulk_order_form.xlsx"}
                className="text-white px-5 py-3 text-[13px] font-semibold no-underline transition-colors"
                style={{ backgroundColor: ACCENT }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7e1a3c")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
              >
                ⬇ Download Our Large Order Form
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">Small Order</h3>
            <p className="text-xs text-[#777] mb-4">Less than 5 recipients</p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[13px] text-[#555]">Simply place your order online</span>
              <Link
                href="/gift-baskets"
                className="text-white px-7 py-3 text-[13px] font-semibold no-underline transition-colors"
                style={{ backgroundColor: ACCENT }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7e1a3c")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Price tier banners */}
      

      {/* Featured Brands */}
      {/* <section className="max-w-[1200px] mx-auto px-5 mb-16 text-center font-hind-madurai">
        <h2 className="text-xl font-bold mb-8">Featured Brands</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
          {BRANDS.map((brand) => (
            <Link key={brand.slug} href={`/${brand.slug}/`} className="relative h-[60px]">
              <Image
                src={`/images/brands/${brand.slug}.png`}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </Link>
          ))}
        </div>
      </section> */}
    </main>
  );
}