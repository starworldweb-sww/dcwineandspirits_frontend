"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Mail, Phone, Clock } from "lucide-react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";

const ACCENT = "#8c1a3c";

const breadcrumbs = [
  { label: "Account", href: "/account" },
  { label: "FAQs", href: "/faqs" },
];

// 1. Poora FAQ data - sabhi categories aur answers fill kiye hue
const faqCategories = [
  {
    title: "Shipping & Delivery",
    questions: [
      {
        q: "Is Same Day Delivery Available?",
        a: "Yes! Same-day delivery is available in DC & Virginia at nearby places like Falls Church, Vienna, Oakton, Great Falls, Tysons Corner, McLean, Reston, Sterling, Fairfax, Arlington, Annandale, and Washington DC. Confirm before order.",
      },
      {
        q: "What Shipping Methods Do You Provide?",
        a: "We ship via UPS Ground (main shipper for alcohol), with Next Day Air and 2nd Day Air options available at extra cost. Ground delivery takes 2-3 business days for the east coast and 4-5 for the west coast.",
      },
      {
        q: "How Long Will It Take To Receive My Order?",
        a: "Standard delivery takes 2-5 business days. Most orders ship the next business day. Expedited options are available for faster delivery.",
      },
      {
        q: "What Are The Delivery Charges?",
        a: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Standard Delivery: $20</li>
            <li>Particular Locations: $30</li>
            <li>Same-Day Delivery (DC & VA Only): $50</li>
            <li>Free Shipping: Available on special orders for select locations</li>
            <li className="list-none pt-2">
              Charges are non-refundable for returns or replacements.
            </li>
          </ul>
        ),
      },
      {
        q: "What Cities And States Do You Ship To?",
        a: "We offer nationwide shipping to most U.S. states and major cities. Due to alcohol shipping restrictions, some states have limitations. Contact us to verify shipping to your location.",
      },
      {
        q: "How far in advance should I order for specific delivery dates?",
        a: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Standard: Order 3-5 business days before desired date</li>
            <li>Same-Day: Order before 2:00 PM EST on business days (DC/VA/MD only)</li>
            <li>Holiday Periods: Order 7-10 days in advance</li>
            <li>Last-Minute: Contact us for expedited options; we often accommodate next-day delivery</li>
          </ul>
        ),
      },
      {
        q: "Do shipments arrive on weekends?",
        a: "No. Standard UPS Ground deliveries are M-F only. Plan accordingly or choose expedited options for Friday delivery.",
      },
      {
        q: "Can I change my delivery address after placing an order?",
        a: "Address changes can be made within 2 hours of order placement if it hasn't shipped. Contact us immediately at contact@dcwineandspirits.com or +1 202-459-8489.",
      },
      {
        q: "What happens to perishable items during hot weather?",
        a: "Perishable items (chocolate, gourmet items) shipped May-October require special handling. Orders placed Thu-Sun ship Mon to prevent weekend delays. We cannot guarantee items won't melt in transit during summer.",
      },
      {
        q: "Do you offer international shipping?",
        a: "Currently, we ship within the United States only. Alcohol shipping to certain states is restricted by law. Contact us to confirm availability.",
      },
      {
        q: "Can you ship to multiple recipients in one order?",
        a: "Yes! You can send gifts to multiple addresses in a single order. Provide a list of recipient addresses and we'll manage shipment and tracking for each.",
      },
    ],
  },
  {
    title: "Orders & Customization",
    questions: [
      {
        q: "Do I need an account to purchase?",
        a: "No! You can checkout as a guest. However, creating an account allows faster checkout, order tracking, and saved preferences.",
      },
      {
        q: "Can I customize wine or champagne bottles?",
        a: "Yes! We offer personalized labels, custom messages, engraving options, and hand-painted bottles. Contact us at contact@dcwineandspirits.com or +1 202-459-8489.",
      },
      {
        q: "Can I customize my gift basket?",
        a: "Absolutely! Pair any basket with any wine/champagne from our site. Contact us via chatbot, email, or phone for customization options.",
      },
      {
        q: "Do you include gift messages?",
        a: "Yes! You can write a free greeting message during checkout, and we'll attach a card with your basket.",
      },
      {
        q: "Can I modify my order after placing it?",
        a: "Order modifications can be made within 2 hours of purchase if not yet processed. Contact us immediately at contact@dcwineandspirits.com.",
      },
      {
        q: "How long do customized orders take?",
        a: "Standard customization: 24 hours. For complex custom orders with branded items: 3-5 business days. Contact us ahead of time for rush options.",
      },
      {
        q: "Can you include company logos or branding?",
        a: "Yes! We can customize gifts with logos, company branding, custom ribbon, and personalized gift tags. Some products cannot be imprinted directly but can have branded packaging.",
      },
      {
        q: "Can I rush an order?",
        a: "Yes! We process rush orders throughout the day. For same-day or next-day delivery, place orders before 2:00 PM EST and contact us to confirm expedited processing.",
      },
      {
        q: "What if I need to cancel or make changes?",
        a: "Contact us within 2 hours of order placement. After processing begins, cancellations may incur fees. Reach out ASAP to discuss options.",
      },
    ],
  },
  {
    title: "Payment & Refunds",
    questions: [
      {
        q: "What Payment Methods Do You Accept?",
        a: "We accept all major credit/debit cards: Visa, MasterCard, American Express, Discover, PayPal, and Stripe.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. We use industry-standard SSL encryption and process all payments through trusted, secure gateways. Your card data is never stored on our servers.",
      },
      {
        q: "Do you offer payment plans or financing?",
        a: "For bulk/corporate orders, we can discuss custom payment arrangements. Contact our sales team at contact@dcwineandspirits.com.",
      },
      {
        q: "What Is Your Return Policy?",
        a: "Returns are evaluated per order. For unopened, original-condition bottles within 30 days of delivery, we offer replacement or refund (excluding shipping). See return policy page for details.",
      },
      {
        q: "What Happens if My Gift Arrives Damaged?",
        a: "We guarantee satisfaction. Contact us within 48 hours with photos. We'll ship a replacement (usually within 24 hours) or provide a full refund.",
      },
      {
        q: "Can I get a refund or exchange?",
        a: "Yes, within 30 days for unopened bottles in original condition. Refunds exclude shipping costs. Contact us at contact@dcwineandspirits.com for return authorization.",
      },
      {
        q: "Do you offer discounts or price matching?",
        a: "We frequently offer seasonal sales and promotions. Sign up for our newsletter for a $10 first-order discount and exclusive deals. Check our Coupon & Deals page.",
      },
      {
        q: "Are there hidden fees or charges?",
        a: "No. All costs including delivery, tax, and fees are shown at checkout before payment. Delivery charges are non-refundable for returns.",
      },
    ],
  },
  {
    title: "Products & Information",
    questions: [
      {
        q: "What Are Your Most Popular Brands?",
        a: "We carry luxury brands including Veuve Clicquot, Dom Pérignon, Caymus, Opus One, Silver Oak, and premium items from Tiffany & Co., Godiva, and Hickory Farms.",
      },
      {
        q: "What Holidays And Occasions Do You Serve?",
        a: "We offer gifts for: weddings, anniversaries, graduations, mother's day, father's day, birthdays, Christmas, thank you, retirement, corporate events, sympathy, get well, divorce support, pet loss, and many more.",
      },
      {
        q: "What age restrictions apply?",
        a: "You must be 21+ to purchase or receive alcohol. We verify ID at delivery.",
      },
      {
        q: "What wine regions do you carry?",
        a: "We offer wines from Australia, France, Italy, Napa Valley, Paso Robles, Spain, Portugal, and Israel.",
      },
      {
        q: "Can you recommend wines for me?",
        a: "Absolutely! Our team provides personalized recommendations based on preferences, budget, and occasion. Email contact@dcwineandspirits.com or call +1 202-459-8489.",
      },
      {
        q: "Are all your products authentic?",
        a: "Yes, 100% authentic. All products are sourced directly from authorized distributors. We guarantee the authenticity of every bottle.",
      },
      {
        q: "Do you carry spirits and liquor beyond wine?",
        a: "Yes, we offer champagne, prosecco, and premium spirits. Browse our full product catalog or contact us for specific requests.",
      },
      {
        q: "Can you source products not listed?",
        a: "Yes! Contact us with your request and we'll work to find it for you.",
      },
    ],
  },
  {
    title: "Bulk & Corporate Orders",
    questions: [
      {
        q: "What Is The Process For Bulk Orders?",
        a: (
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              Download our{" "}
              <a
                href="https://www.dcwineandspirits.com/bulk-order-form.xlsx"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: ACCENT }}
                className="underline"
              >
                Bulk Orders Form
              </a>{" "}
              from website
            </li>
            <li>Complete with details and product list</li>
            <li>Send back for review</li>
            <li>Receive confirmation invoice</li>
            <li>Payment secures delivery</li>
          </ol>
        ),
      },
      {
        q: "Do you offer bulk discounts?",
        a: "Yes! The more you order, the greater your savings. Contact contact@dcwineandspirits.com or +1 202-459-8489 for bulk pricing.",
      },
      {
        q: "What is the minimum for bulk purchases?",
        a: "Bulk orders typically start at 10+ units, but we're flexible. Contact us to discuss your specific needs.",
      },
      {
        q: "Can bulk orders have company branding?",
        a: "Yes! We offer branded boxes, custom labels, engraving, and corporate personalization. Contact our corporate team.",
      },
      {
        q: "What are payment terms for large orders?",
        a: "We offer NET 30 payment terms for qualified corporate customers. Contact us to discuss arrangements for your order.",
      },
      {
        q: "Do you make corporate/convention gifts?",
        a: "Yes! We create custom gifts for conventions, employee appreciation, client gifts, and corporate events.",
      },
      {
        q: "Can you handle hotel/venue delivery for events?",
        a: "Yes! We coordinate deliveries to hotels, venues, and conference centers. Contact us for special event logistics.",
      },
      {
        q: "Is there a discount for non-profit organizations?",
        a: "Contact us at contact@dcwineandspirits.com to discuss non-profit pricing options.",
      },
    ],
  },
  {
    title: "Customer Support & Tracking",
    questions: [
      {
        q: "How Can I Track My Order?",
        a: "You'll receive a UPS tracking number in your shipping confirmation email. Track real-time delivery status via UPS.",
      },
      {
        q: "How do I contact customer support?",
        a: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Email: contact@dcwineandspirits.com</li>
            <li>Phone: +1 202-459-8489 (Mon-Fri, 10 AM - 5 PM EST)</li>
            <li>Chatbot: 24/7 on our website</li>
            <li>Online Orders: Available 24/7</li>
          </ul>
        ),
      },
      {
        q: "What is your response time?",
        a: "We respond to all inquiries within 24 hours on business days. For urgent matters, call +1 202-459-8489 during business hours.",
      },
      {
        q: "Do you have a loyalty or rewards program?",
        a: "Sign up for our newsletter to get exclusive discounts, early access to sales, and special offers. First-time subscribers get $10 off their first order.",
      },
      {
        q: "Can I leave a review?",
        a: "Yes! We'd love your feedback. Leave reviews on our products, Testimonials page, Google Reviews, Trustpilot, or other platforms you may love to.",
      },
      {
        q: "What if I have a complaint or issue?",
        a: "We take all complaints seriously. Contact us with details at contact@dcwineandspirits.com or +1 202-459-8489. We'll work to resolve it quickly.",
      },
      {
        q: "Will my recipient be notified of the gift?",
        a: "Specify notification preference (email, call, or text) in the checkout notes. We can notify them of the shipment.",
      },
      {
        q: "What if the recipient is unavailable at delivery?",
        a: (
          <>
            <p className="mb-2">
              For residential deliveries, we require an adult signature. Leave the recipient phone number at checkout so we can coordinate delivery.
            </p>
            <p className="mb-2">
              UPS makes up to three delivery attempts for your package. If all three attempts are unsuccessful, you have the following options:
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                Package Return & Reship: The package can be returned to us for processing. We can restart the shipping process; however, additional shipping charges will apply.
              </li>
              <li>
                Local UPS Pickup: The package can be held at a nearby UPS location for 4–5 days, allowing the recipient to pick it up at their convenience within that timeframe.
              </li>
              <li>
                Reschedule Delivery: You may reschedule the delivery for a preferred date. Please note that additional charges may apply for this service.
              </li>
            </ol>
          </>
        ),
      },
      {
        q: "Can I gift wrap items?",
        a: "All baskets come beautifully arranged and ready-to-gift. Premium wrapping and custom presentation options are available. Contact us for details.",
      },
      {
        q: "Do you offer gift subscriptions?",
        a: "Yes! Customers can set up recurring deliveries. Contact us for gift subscription options and pricing.",
      },
    ],
  },
  {
    title: "Legal & Compliance",
    questions: [
      {
        q: "What is your legal drinking age policy?",
        a: "You must be 21+ in the US to order and receive alcohol. We verify ID at delivery and will not release it to underage recipients.",
      },
      {
        q: "Which states have alcohol shipping restrictions?",
        a: "Some states restrict alcohol shipments. We'll notify you immediately if your address is in a restricted area and discuss alternatives.",
      },
      {
        q: "What is your fraud prevention policy?",
        a: "For orders over $499.99, we require written consent and photo ID. We reserve the right to deny service for suspicious activity.",
      },
      {
        q: "How do you protect my personal data?",
        a: "We comply with GDPR, CCPA, and all relevant privacy regulations. Your data is encrypted and never shared without consent.",
      },
      {
        q: "Do you have a Privacy Policy and Terms?",
        a: "Yes, both available on our website. Review them for complete terms of service and data handling practices.",
      },
    ],
  },
];

const usefulLinks = [
  { label: "About Us", href: "https://www.dcwineandspirits.com/about-us/" },
  { label: "Delivery Information", href: "https://www.dcwineandspirits.com/shipping-and-delivery-policy/" },
  { label: "Terms & Conditions", href: "https://www.dcwineandspirits.com/terms/" },
  { label: "Privacy Policy", href: "https://www.dcwineandspirits.com/privacy/" },
  { label: "Coupon & Deals", href: "https://www.dcwineandspirits.com/coupon-and-deals" },
  { label: "Blogs", href: "https://www.dcwineandspirits.com/blogs/" },
  { label: "Our Brands", href: "https://www.dcwineandspirits.com/brands" },
  { label: "Contact Us", href: "https://www.dcwineandspirits.com/contact" },
];

const QuestionsClient = () => {
  // 2. Multiple accordions ek saath open rakhne ke liye Set use kiya (single value ke bajaye)
  const [openIndexes, setOpenIndexes] = useState(new Set());

  const toggleQuestion = (index) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev); // 3. purane open items ko chhedte nahi, sirf clicked wale ko toggle karte hain
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="DC Wine & Spirits" breadcrumbs={breadcrumbs} />

      <div className="w-full px-3 lg:px-3 2xl:px-32 mt-6 mb-4">
        <p className="text-[14px] font-hind-madurai text-[#444444]">
          Have questions about shipping, orders, customization, or our products? Find answers below.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mb-14">
        {/* ---- LEFT: FAQ Accordion (all categories) ---- */}
        <div className="flex-1 min-w-0 w-full">
          {faqCategories.map((category, catIdx) => (
            <div key={catIdx} className="mb-10">
              <h2 className="text-[16px] font-hind-madurai font-bold tracking-wide text-[#333333] uppercase pb-3 mb-4 border-b border-[#333333] inline-block">
                {category.title}
              </h2>

              <div
                className="border-l-4 pl-4 space-y-3 mt-2"
                style={{ borderColor: ACCENT }}
              >
                {category.questions.map((item, qIdx) => {
                  const index = `${catIdx}-${qIdx}`;
                  const isOpen = openIndexes.has(index); // 4. Set.has() se check, isse multiple ek saath khul sakte hain

                  return (
                    <div key={index} className="bg-[#eeeeee] rounded-[4px]">
                      <button
                        onClick={() => toggleQuestion(index)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                      >
                        <span className="font-hind-madurai font-semibold text-[14px] text-[#333333]">
                          {item.q}
                        </span>
                        <ChevronDown
                          size={18}
                          style={{ color: ACCENT }}
                          className={`shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-4 text-[13.5px] font-hind-madurai text-[#444444] leading-[1.7]">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Still Have Questions? contact block */}
          <div className="bg-[#eeeeee] rounded-[4px] p-6 md:p-8">
            <h2 className="text-[18px] font-hind-madurai font-semibold text-[#333333] pb-3 mb-4 border-b border-[#333333] inline-block">
              Still Have Questions?
            </h2>
            <p className="text-[14px] font-hind-madurai text-[#444444] mb-4">
              Contact DC Wine & Spirits Customer Support
            </p>
            <div className="flex flex-col gap-2.5 text-[13.5px] font-hind-madurai text-[#444444]">
              <div className="flex items-center gap-2">
                <Mail size={15} style={{ color: ACCENT }} />
                <a href="mailto:contact@dcwineandspirits.com" className="hover:opacity-80">
                  contact@dcwineandspirits.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} style={{ color: ACCENT }} />
                <a href="tel:2024598489" className="hover:opacity-80">
                  +1 202-459-8489
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} style={{ color: ACCENT }} />
                <span>Hours: Mon-Fri 9:00 AM - 6:00 PM EST</span>
              </div>
              <div className="flex items-center gap-2 pl-[23px]">
                <span>Online Orders & Chatbot: 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---- RIGHT: Useful Links Sidebar ---- */}
        <div className="w-full lg:w-[260px] shrink-0">
          <div className="bg-[#eeeeee] rounded-[4px] p-6">
            <h2 className="text-[18px] font-hind-madurai font-semibold text-[#333333] pb-3 mb-3 border-b border-[#333333] inline-block">
              Useful Links
            </h2>
            <div className="flex flex-col mt-2">
              {usefulLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="text-[13.5px] font-hind-madurai text-[#444444] py-2.5 border-b border-[#d9d9d9] last:border-b-0 transition-colors duration-200 hover:opacity-80"
                  onMouseEnter={(e) => (e.target.style.color = ACCENT)}
                  onMouseLeave={(e) => (e.target.style.color = "#444444")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsClient;