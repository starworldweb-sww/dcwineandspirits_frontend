"use client";

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

// 2. Link data - edit these arrays to add/remove/rename footer links
const myAccountLinksLeft = [
  { label: "My Account", href: "/account" },
  { label: "Order History", href: "/account/orders" },
  { label: "Affiliates", href: "/affiliates" },
  { label: "Sitemap", href: "/sitemap" },
];

const myAccountLinksRight = [
  { label: "Gift Certificates", href: "/gift-certificates" },
  { label: "Brands", href: "/brands" },
  { label: "Blogs", href: "/blog" },
  { label: "Newsletter", href: "/newsletter" },
];

const customerServiceLinksLeft = [
  { label: "About Us", href: "/about-us" },
  { label: "Shipping & Delivery", href: "/shipping-delivery" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Return Policy", href: "/return-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Testimonials", href: "/testimonials" },
];

const customerServiceLinksRight = [
  { label: "Coupon & Deals", href: "/coupons-deals" },
  { label: "Corporate / Bulk Inquiry", href: "/corporate-bulk-inquiry" },
  { label: "Bulk Order Form", href: "/bulk-order-form" },
  { label: "FAQ's", href: "/faqs" },
  { label: "Contact", href: "/contact" },
];

// 3. Social links - swap the icon or href for each platform here
const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinIcon },
  { label: "YouTube", href: "https://youtube.com", Icon: YoutubeIcon },
  { label: "Twitter", href: "https://twitter.com", Icon: TwitterIcon },
  // Note: no Pinterest icon here, swap in your own Pinterest SVG/asset if needed.
];

// 4. Small reusable component for a single footer link row
function FooterLink({ label, href }) {
  return (
    <li>
      <a
        href={href}
        className="flex items-center gap-1 text-sm text-gray-700 hover:text-[#8a1538]"
      >
        <ChevronRight size={14} className="text-[#8a1538]" />
        {label}
      </a>
    </li>
  );
}

export default function Footer() {
  return (

    <>
    <NewsletterSection/>
    <footer className={`w-full bg-white ${hindMadurai.variable}`} style={{ fontFamily: "var(--font-hind-madurai)" }}>
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
            <img
              src="/dc-wine_logo-360x90.webp"
              alt="DC Wine & Spirits"
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
                <a href="tel:+12024598489" className="hover:text-[#8a1538]">
                  (202) 459-8489
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="flex-shrink-0 text-gray-500" />
                <a
                  href="mailto:contact@dcwineandspirits.com"
                  className="hover:text-[#8a1538]"
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
        <div className="flex flex-col items-center gap-6 py-6 md:flex-row md:justify-between">
          {/* 8a. Social icons */}
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-gray-800">Follow Us</span>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8a1538] text-white transition hover:bg-[#6d1029]"
                >
                  <Icon width={16} height={16} />
                </a>
              ))}
            </div>
          </div>

          {/* 8b. Review badges - built with text + icons instead of trademarked logos,
               swap in the real Trustpilot / Google Reviews badge images if you have them */}
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-gray-800">Review Us</span>

            <div className="flex items-center gap-3">
              {/* Trustpilot circle badge - green, with a star inside like the social icons */}
              <a
                href="https://www.trustpilot.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Trustpilot Reviews"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00b67a] text-white transition hover:bg-[#00945f]"
              >
                <Star size={16} className="fill-white text-white" />
              </a>

              {/* Google circle badge - a simple "G" instead of the trademarked
                  Google logo asset, swap in your own asset if you have one */}
              <a
                href="https://www.google.com/search?q=dc+wine+and+spirits+reviews"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Reviews"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-bold text-[#4285F4] shadow transition hover:shadow-md"
              >
                G
              </a>
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
            {["Visa", "Mastercard", "Amex", "Discover", "PayPal", "Stripe"].map(
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
          We sell, deliver & ship wines where allowed by law. You must be 21
          years of age or older to purchase or receive an alcohol product
          from us. We will verify your ID during delivery process.
        </p>
      </div>
    </footer>
    </>
  );
}