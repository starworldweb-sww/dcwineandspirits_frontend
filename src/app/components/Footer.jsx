"use client";

import Image from "next/image";
import { Hind_Madurai } from "next/font/google";
import {
  ChevronRight,
  Clock,
  Headphones,
  Phone,
  Mail,
  Star,
} from "lucide-react";
import NewsletterSection from "./NewsletterSection";

// 1. Font - everything in the footer uses Hind Madurai
const hindMadurai = Hind_Madurai({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-madurai",
});

// 1a. lucide-react dropped brand/logo icons (Facebook, Instagram, etc.) a
// while back, so these are small hand-rolled SVGs in the same line-icon
// style. Feel free to swap these for your own brand assets later.
function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  );
}

// 1b. Real Trustpilot mark (green circle with the 5-pointed "star" bracket
// glyph) and the real multi-colour Google "G" logo, used in the Review Us
// row below.
function TrustpilotIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 17.27 17.18 21l-1.64-6.31L21 10.24l-6.36-.49L12 4l-2.64 5.75L3 10.24l4.46 4.45L5.82 21z"
      />
    </svg>
  );
}

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3.02h3.88c2.27-2.09 3.57-5.17 3.57-8.84z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.11A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.28a12 12 0 0 0 0 10.8z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.6l4.01 3.11C6.23 6.88 8.88 4.77 12 4.77z"
      />
    </svg>
  );
}

// 2. Link data - edit these arrays to add/remove/rename footer links
const myAccountLinksLeft = [
  { label: "My Account", href: "/account/" },
  { label: "Order History", href: "/account/order/" },
  { label: "Affiliates", href: "/affiliate/" },
  { label: "Sitemap", href: "/sitemap/" },
];

const myAccountLinksRight = [
  { label: "Gift Certificates", href: "/voucher/" },
  { label: "Brands", href: "/brands/" },
  { label: "Blogs", href: "/blogs/" },
  { label: "Newsletter", href: "/newsletter/" },
];

const customerServiceLinksLeft = [
  { label: "About Us", href: "/about-us/" },
  { label: "Shipping & Delivery", href: "/shipping-and-delivery-policy/" },
  { label: "Privacy Policy", href: "/privacy/" },
  { label: "Return Policy", href: "/return-policy/" },
  { label: "Terms & Conditions", href: "/terms/" },
  { label: "Testimonials", href: "/testimonials" },
];

const customerServiceLinksRight = [
  { label: "Coupon & Deals", href: "/coupon-and-deals/" },
  { label: "Corporate / Bulk Inquiry", href: "/corporate/" },
  {
    label: "Bulk Order Form",
    href: "/bulk-order-form.xlsx",
    download: "bulk-order-form.xlsx",
  },
  { label: "FAQ's", href: "/frequently-asked-questions/" },
  { label: "Contact", href: "/contact/" },
];

// 3. Social links - swap the icon or href for each platform here
const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/dcwineandspirits.official/", Icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/dcwineandspirits/", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/dc-wine-spirits/", Icon: LinkedinIcon },
  { label: "YouTube", href: "https://www.youtube.com/@dcwineandspirits/", Icon: YoutubeIcon },
  { label: "Twitter", href: "https://x.com/dcwine_spirits/", Icon: TwitterIcon },
  // Note: no Pinterest icon here, swap in your own Pinterest SVG/asset if needed.
];

// 3a. Review platform data - labeled "pill" style badge: platform name +
// small icon + 5-star row above the name.
const reviewLinks = [
  {
    label: "Trustpilot",
    href: "https://www.trustpilot.com/review/dcwineandspirits.com/",
    Icon: TrustpilotIcon,
    iconBg: "bg-[#00b67a]",
    iconColor: "text-white",
  },
  {
    label: "Google",
    href: "https://g.page/r/CT-eswvbpQaMEAE/review/",
    Icon: GoogleIcon,
    iconBg: "bg-white",
    iconColor: "",
  },
];

// 4. Small reusable component for a single footer link row
// `download` is optional - jab pass hoga tab link file download karega,
// warna pehle jaisa normal navigation hoga.
// FIX: click/tap (mouse-down ya touch) ke time underline dikhega -
// `active:underline` mouse click aur touch dono pe fire hota hai,
// `focus:underline` keyboard/tab navigation ke liye bhi feedback deta hai.
function FooterLink({ label, href, download }) {
  return (
    <li>
      <a
        href={href}
        {...(download ? { download } : {})}
        className="flex items-center gap-1 text-sm text-gray-700  group  hover:text-[#8a1538] active:underline active:text-[#8a1538] focus:underline focus:text-[#8a1538] focus:outline-none"
      >
        <ChevronRight size={14} className="text-[#8a1538]" />
       <span  className="visited:text-[#8a1538]"> {label}</span> 
      </a>
    </li>
  );
}

export default function Footer() {
  return (

    <>
    <NewsletterSection/>
    <footer className={`w-full bg-white overflow-x-hidden ${hindMadurai.variable}`} style={{ fontFamily: "var(--font-hind-madurai)" }}>
      {/* 5. Padding convention applied here */}
      <div className="px-3 2xl:px-32 py-12">
        {/* 6. Top grid - link columns + logo/contact column */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr_auto]">
          {/* 6a. My Account column */}
          <div>
            <h3 className="border-b border-gray-200 pb-3 text-sm font-bold uppercase tracking-wide text-gray-800">
              My Account
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
              <ul className="space-y-3">
                {myAccountLinksLeft.map((link) => (
                  <FooterLink key={link.label} {...link} />
                ))}
              </ul>
              <ul className="space-y-3">
                {myAccountLinksRight.map((link) => (
                  <FooterLink key={link.label} {...link} />
                ))}
              </ul>
            </div>
          </div>

          {/* 6b. Customer Service column */}
          <div>
            <h3 className="border-b border-gray-200 pb-3 text-sm font-bold uppercase tracking-wide text-gray-800">
              Customer Service
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
              <ul className="space-y-3">
                {customerServiceLinksLeft.map((link) => (
                  <FooterLink key={link.label} {...link} />
                ))}
              </ul>
              <ul className="space-y-3">
                {customerServiceLinksRight.map((link) => (
                  <FooterLink key={link.label} {...link} />
                ))}
              </ul>
            </div>
          </div>

          {/* 6c. Logo + contact info column */}
          <div className="lg:w-[300px]">
            <Image
              src="/dc-wine_logo-360x90.webp"
              alt="DC Wine & Spirits"
              width={360}
              height={90}
              className="h-14 w-auto object-contain"
            />

            <div className="mt-6 space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 flex-shrink-0 text-gray-500" />
                <p>
                  Monday – Sunday
                  <br />
                  Open 24 Hours (Online Orders)
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Headphones size={18} className="mt-0.5 flex-shrink-0 text-gray-500" />
                <p>
                  Customer Support: Monday–Friday,
                  <br />
                  10:00 AM – 5:00 PM (EST)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="flex-shrink-0 text-gray-500" />
                <a href="tel:+12024598489" className="hover:text-[#8a1538] active:underline focus:underline focus:outline-none">
                  (202) 459-8489
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="flex-shrink-0 text-gray-500" />
                <a
                  href="mailto:contact@dcwineandspirits.com"
                  className="hover:text-[#8a1538] active:underline focus:underline focus:outline-none"
                >
                  contact@dcwineandspirits.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Divider */}
        <hr className="mt-10 border-gray-200" />

        {/* 8. Follow Us + Review Us row */}
        {/* FIX: row ab "lg" pe row banti hai (pehle "md" pe thi, jahan
            jagah kam hoti hai) aur "flex-wrap" hai - agar kabhi content
            container se chhota bhi na fit ho to wrap ho jayega, page
            overflow kabhi nahi hoga. */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 py-6 lg:justify-between">
          {/* 8a. Social icons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-lg font-bold text-gray-800">Follow Us</span>
            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8a1538] text-white transition hover:bg-[#6d1029] active:ring-2 active:ring-[#6d1029] active:ring-offset-2 focus:ring-2 focus:ring-[#6d1029] focus:ring-offset-2 focus:outline-none"
                >
                  <Icon width={16} height={16} />
                </a>
              ))}
            </div>
          </div>

          {/* 8b. Review badges - labeled "pill" cards with a 5-star row
               above the platform name. Real Trustpilot (green circle +
               star bracket mark) and real multi-colour Google "G" logo. */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-lg font-bold text-gray-800">Review Us</span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {reviewLinks.map(({ label, href, Icon, iconBg, iconColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} Reviews`}
                  className="group flex shrink-0 items-center gap-2.5 rounded-full border border-gray-200 bg-white pl-1.5 pr-4 py-1.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:ring-2 active:ring-[#8a1538]/40 focus:ring-2 focus:ring-[#8a1538]/40 focus:outline-none"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBg} ${iconColor} ${
                      label === "Google" ? "border border-gray-200" : ""
                    }`}
                  >
                    <Icon width={16} height={16} />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className="fill-[#f5a623] text-[#f5a623]"
                        />
                      ))}
                    </span>
                    <span className="whitespace-nowrap text-xs font-semibold text-gray-700 group-hover:text-[#8a1538] normal-case">
                      {label}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 9. Bottom black bar - copyright, payment badges, legal disclaimer */}
      <div className="bg-black px-3 2xl:px-32 py-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm">
            Copyright © 2014-2026, dcwineandspirits, All Rights Reserved.
          </p>

          {/* 9a. Payment method badges - simple text badges instead of trademarked logos */}
          <div className="flex flex-wrap gap-2">
            {["Visa", "Mastercard", "Amex", "Discover", "Stripe"].map(
              (method) => (
                <span
                  key={method}
                  className="rounded border border-gray-500 px-2 py-1 text-xs text-gray-200"
                >
                  {method}
                </span>
              )
            )}
          </div>
        </div>
          <p className="mt-4 text-xs text-gray-300">
          <span className="font-semibold">Trademark Notice: </span>
          Veuve Clicquot, Dom Pérignon, Moët & Chandon,
          Caymus, Godiva and all other third-party brand names, product
          names, logos and trademarks referenced on this website are the
          property of their respective owners. Such trademarks are used to
          identify the genuine products offered for sale. DC Wine & Spirits
          independently curates and assembles its gift baskets and is not
          sponsored, endorsed, authorized, or affiliated with the respective
          trademark owners unless expressly stated otherwise.
        </p>

        <p className="mt-4 text-xs text-gray-300">
          We sell, deliver & ship wines where allowed by law. You must be 21
          years of age or older to purchase or receive an alcohol product
          from us. We will verify your ID during delivery process.
        </p>

      
      </div>
    </footer>
    </>
  );
}