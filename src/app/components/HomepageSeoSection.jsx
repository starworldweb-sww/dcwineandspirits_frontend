"use client";

import { useState } from "react";
import { Sumana, Hind_Madurai } from "next/font/google";
import { ChevronUp, ChevronDown } from "lucide-react";

// 1. Fonts - heading uses Sumana, body content uses Hind Madurai
const sumana = Sumana({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sumana",
});

const hindMadurai = Hind_Madurai({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hind-madurai",
});

// 2. Stats shown in the "Why Shop with DC Wine & Spirits" grid
const whyShopItems = [
  {
    emoji: "🚚",
    title: "Fast Delivery",
    text: "Same-Day & Next-Day Wine Gift Delivery Available",
  },
  {
    emoji: "🍷",
    title: "Premium Selection",
    text: "150+ Premium Wine Brands from Top Regions",
  },
  {
    emoji: "🎁",
    title: "Huge Variety",
    text: "1,200+ Curated Wine & Gift Combinations",
  },
  {
    emoji: "⭐",
    title: "Trusted by Customers",
    text: "22,000+ Happy Customers Served",
  },
  {
    emoji: "📦",
    title: "Reliable Service",
    text: "50,000+ Orders Delivered Nationwide",
  },
  {
    emoji: "💝",
    title: "Perfect for Every Occasion",
    text: "Birthday, Anniversary, Congratulations & More",
  },
];

export default function HomepageSeoSection() {
  // 3. Controls whether the full SEO content + grid is visible
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      className={`${sumana.variable} ${hindMadurai.variable} w-full`}
      style={{ backgroundColor: "#F1F1F1" }}
    >
      {/* 4. Padding convention applied here */}
      <div className="px-3 2xl:px-32 py-12">
        {/* 5. Main heading */}
        <h2
          className="text-2xl md:text-3xl text-black mb-3"
          style={{ fontFamily: "var(--font-sumana)" }}
        >
          DC Wine and Spirits – Your Trusted Wine Gift Partner
        </h2>

        <h3
          className="text-base md:text-lg font-bold text-black mb-4"
          style={{ fontFamily: "var(--font-sumana)" }}
        >
          Unwind and Indulge With DC Wine and Spirits: The Ultimate
          Destination for Wines, Champagne and Gourmet Baskets
        </h3>

        {/* 6. Body copy - always visible part */}
        <div
          className="text-sm md:text-base text-gray-800 leading-relaxed space-y-4"
          style={{ fontFamily: "var(--font-hind-madurai)" }}
        >
          <p>
            Welcome to DC Wine & Spirits, where flawless gift-giving answers
            await. DC wine store is one of the best online wine gift stores
            in the USA, known for its fast and reliable delivery services.
            We are a family-owned online wine gifts store based in the DC,
            United States. Founded in 2014 and launched as an online wine
            gift shop in 2018, with the mission of assisting people in
            turning their upcoming celebrations into milestone memories. We
            provide our customers with a wide selection of the finest gifts,
            including wines, champagnes, and gourmet gift baskets.
          </p>

          <p>
            Whether you want to say "Happy Birthday" with{" "}
            <a href="/birthday-wine-gift-basket" className="text-[#b8225a] hover:underline">
              Birthday Wine Gift Basket
            </a>{" "}
            to a friend, send an{" "}
            <a href="/anniversary" className="text-[#b8225a] hover:underline">
              Anniversary gift
            </a>{" "}
            to your partner, or thoughtfully nestle{" "}
            <a href="/congratulations" className="text-[#b8225a] hover:underline">
              Congratulations
            </a>{" "}
            into a housewarming gift, we have you covered! We also have a
            track record of handling{" "}
            <a href="/bulk-corporate-orders" className="text-[#b8225a] hover:underline">
              bulk corporate orders
            </a>
            , thanks to our team that expertly handles each task- from
            assisting you in choosing the ideal gift to hand assorting it
            and delivering it to its intended address with no hassle.
          </p>

          {/* 7. Extra content only shown when expanded */}
          {expanded && (
            <>
              <h3
                className="text-base md:text-lg font-bold text-black pt-2"
                style={{ fontFamily: "var(--font-sumana)" }}
              >
                Extensive Wine Collection
              </h3>
              <p>
                We recognize the cultural passion for wine and are dedicated
                to elevating the art of pouring, sipping, and sharing. We
                take great pride in our premium{" "}
                <a href="/wine-collection" className="text-[#b8225a] hover:underline">
                  wine collection
                </a>
                , which includes bold to easy-drinking reds, whites, rosés,
                and{" "}
                <a href="/proseccos" className="text-[#b8225a] hover:underline">
                  proseccos
                </a>{" "}
                and{" "}
                <a href="/champagnes" className="text-[#b8225a] hover:underline">
                  champagnes
                </a>{" "}
                from around the world. Each bottle of wine is hand-selected
                based on its finesse, distinctiveness, and often rarity on
                the market.
              </p>

              <h3
                className="text-base md:text-lg font-bold text-black pt-2"
                style={{ fontFamily: "var(--font-sumana)" }}
              >
                Wine Regions & Brands
              </h3>
              <p>
                In addition to their distinctive flavors, our wines are
                distinguished by the "sense of place" that they embody. Each
                bottle of wine originates from an exceptional terroir, which
                imparts its character to the final product. You can also
                customize a gift basket by combining any wine bottle with
                any gift basket of your choosing. We recently added the
                choice of custom-printed wine and champagne bottles, and{" "}
                <a href="/hand-painted-bottles" className="text-[#b8225a] hover:underline">
                  hand-painted wine and champagne bottles
                </a>
                . Sincere greetings on special occasions with bottles covered
                in floral patterns and congratulations decals.
              </p>

              <h3
                className="text-base md:text-lg font-bold text-black pt-2"
                style={{ fontFamily: "var(--font-sumana)" }}
              >
                Hassle-Free Wine Gifts Delivery
              </h3>
              <p>
                We offer gift delivery in the United States, and each order
                is delivered promptly and with care to the specified
                address. Aside from this, you will get persistent email
                assistance, answers to your queries on chat, a UPS tracking
                ID for long-distance deliveries, and quick refunds or
                replacements in case of any damage that wasn't your fault.
                Here, you can learn more about our return policy. We provide{" "}
                <a href="/champagne-gift-delivery" className="text-[#b8225a] hover:underline">
                  champagne gift delivery
                </a>
                , and{" "}
                <a href="/wine-gift-delivery" className="text-[#b8225a] hover:underline">
                  wine gift delivery
                </a>{" "}
                same-day in{" "}
                <span className="font-bold text-black">
                  Ashburn, Tysons, Falls Church, Arlington, Leesburg,
                  McLean, Vienna and Great Falls
                </span>{" "}
                being the most prominent locations.
              </p>

              <p>
                Whether you have a query or you wish to specify your order,
                you are free to contact us anytime! We are available 24
                hours a day, seven days a week to answer your concerns and
                savvy-up your gift-giving. We hope you appreciate exploring
                our{" "}
                <a href="/products" className="text-[#b8225a] hover:underline">
                  products
                </a>{" "}
                and discovering all the knowledge and expertise we wish to
                impart.
              </p>

              {/* 8. Why Shop With Us heading + stats grid */}
              <h3
                className="text-lg md:text-xl font-bold text-black pt-4"
                style={{ fontFamily: "var(--font-sumana)" }}
              >
                Why Shop with DC Wine & Spirits
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 border border-gray-300 divide-y sm:divide-y-0 divide-gray-300">
                {whyShopItems.map((item, index) => (
                  <div
                    key={item.title}
                    className={`p-6 text-center sm:text-left ${
                      index % 3 !== 2 ? "sm:border-r sm:border-gray-300" : ""
                    } ${index < 3 ? "sm:border-b sm:border-gray-300" : ""}`}
                  >
                    <p className="flex items-center justify-center sm:justify-start gap-2 font-bold text-black text-base">
                      <span>{item.emoji}</span>
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 9. Show More / Show Less toggle */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="flex items-center gap-2 bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show More <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}