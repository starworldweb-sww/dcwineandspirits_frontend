"use client";

import React from "react";
import Link from "next/link";
import ProductsHeader from "../components/TittleAndBreadcrumb";




const AboutClient = () => {
  return (
    <main className="text-[#333333] select-none bg-white min-h-screen flex flex-col w-full font-hind-madurai">
      {/* 1. HEADER WIDGET: Same pattern as other pages */}
      <div className="w-full">
        <ProductsHeader categoryName="About Us" />
      </div>

      {/* 2. PAGE CONTENT */}
      <div className="w-full max-w-[1400px]  px-4 md:px-8 2xl:px-12 py-10 md:py-14">
        <div className="space-y-5 text-[15px] md:text-[16px] leading-[1.75] text-[#333333] normal-case">
          <p>
            <span className="font-bold">DC Wine &amp; Spirits</span> is your
            neighborhood online gift store located in Washington, DC 20008 &amp;
            Vienna, VA 22180. We are a locally owned and operated store
            specializing in handcrafting and delivering generous presents for
            all{" "}
            <Link href="/occasion-gift-basket" className="text-[#98022e]">
              occasions
            </Link>{" "}
            and even the most tricky recipients.
          </p>

          <p>
            We live by one motto: Bring people together and create memories
            that last a lifetime. Shop on our website, which is well
            categorized to make shopping a satisfying experience for you.
          </p>

          <h2 className="font-serif text-[20px] md:text-[24px] font-bold text-[#333333] text-center py-2">
            Considerate Gift Options to Polish Your Gifting and Hosting Skills
          </h2>

          <p>
            There is an enormous choice of gifts at amazing prices, ensuring
            affordability and accessibility for every customer.
          </p>

          <p>
            Expertly blended wines sourced from prominent vineyards in Napa
            Valley and Sonoma County are just the beginning. The selection of
            wines—from the complex reds of Italy&rsquo;s Piedmont region and the
            rich, bold French Bordeaux and Burgundy, to the vibrant Australian
            Barossa Valley and the robust Paso Robles reds from
            California—offers a perfect blend for every mood. Discover the
            exotic depth of Israel&rsquo;s boutique wines, rounding out a global
            collection that spans continents and flavor profiles—from
            red-hued Cabernets to refreshing Chardonnays.
          </p>

          <p>
            Don&apos;t forget to savor the famed richness of Northern France with
            our top champagnes, sparkling with firm effervescence and
            longevity.
          </p>

          <p>
            This diversity is well elaborated in our{" "}
            <Link href="/blogs" className="text-[#98022e]">
              articles
            </Link>{" "}
            to boost a connoisseur&rsquo;s intellect.
          </p>

          <p>
            We recognize the significance of delicacies in the midst of
            celebrations and gift exchanges. Therefore, we present you with an
            impressive selection of{" "}
            <Link href="/gift-baskets" className="text-[#98022e]">
              gift baskets
            </Link>{" "}
            carefully crafted to enhance the palate experiences of your loved
            ones.
          </p>

          <p>
            There are smooth chocolates, melt-in-your-mouth cheese slices,
            finger-licking appetizers, BBQ hits, olives, spreads, and more.
            You can also order these for personal use or{" "}
            <Link href="/corporate-gift-basket" className="text-[#98022e]">
              corporate
            </Link>{" "}
            purposes. You can even pair your favorite basket with any bottle
            and send gift cards to make your gifting experience more
            personalized.
          </p>

          <h2 className="font-serif text-[20px] md:text-[24px] font-bold text-[#333333] text-center py-2">
            Uplift the Conviviality with Our Hassle-Free Delivery Services
          </h2>

          <p>
            Despite being a locally owned company, our delivery services are{" "}
            <span className="font-bold">
              available 24 hours a day, seven days a week
            </span>{" "}
            throughout the United States. Except for PO Boxes and APO
            addresses, our{" "}
            <Link
              href="/shipping-and-delivery-policy"
              className="text-[#98022e]"
            >
              shipping and delivery policy
            </Link>{" "}
            ensures all orders reach their destinations safely and on time.
          </p>

          <p>
            Simply browse the website, place your orders, and we will keep
            you informed with{" "}
            <a
              href="mailto:contact@dcwineandspirits.com"
              className="text-[#98022e]"
            >
              email
            </a>{" "}
            updates,{" "}
            <Link href="/order-tracking" className="text-[#98022e]">
              UPS tracking
            </Link>{" "}
            (for distant deliveries), and quick resolution of any queries.
          </p>

          <p>
            Any damage to bottles or gift baskets resulting from our actions
            is fully examined and promptly replaced as per our{" "}
            <Link href="/return-policy" className="text-[#98022e]">
              return policy
            </Link>
            .
          </p>

          <p>
            To comply with drinking regulations, we retain the right to
            request an adult (above the age of 21) signature prior to
            processing orders and at the time of delivery. So step forward
            and raise your ideal toasts for perfect moments to come!
          </p>
        </div>
      </div>
    </main>
  );
};

export default AboutClient;