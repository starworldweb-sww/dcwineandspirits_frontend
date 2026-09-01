import React from "react";
import { Truck, Wine, Gift, Star, Package, Heart } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Same-Day & Next-Day Gift Delivery Available",
  },
  {
    icon: Wine,
    title: "Premium Selection",
    description: "150+ Premium Wine Brands from Top Regions",
  },
  {
    icon: Gift,
    title: "Huge Gift Collection",
    description: "1,200+ Curated Wine Gift Baskets",
  },
  {
    icon: Star,
    title: "Trusted by Customers",
    description: "22,000+ Happy Customers Served",
  },
  {
    icon: Package,
    title: "Reliable Service",
    description: "50,000+ Orders Delivered Nationwide",
  },
  {
    icon: Heart,
    title: "Perfect for Every Occasion",
    description: "Birthday, Anniversary, Corporate & Holiday Wine Gifts",
  },
];

const WhyChooseUs = () => {
  return (
    <section
      className="w-full bg-white px-3 2xl:px-32 py-10 border-t border-t-[#98022e]"
      aria-labelledby="why-choose-us-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-8 flex flex-col items-center text-center">
          <h2
            id="why-choose-us-heading"
            className="font-sumana text-2xl sm:text-3xl text-black"
          >
            Why Shop with DC Wine &amp; Spirits
          </h2>
          <div className="mt-2 h-[2px] w-12 rounded-full bg-[#98022e]" />
        </div>

        {/* Feature list — plain <ul>/<li>, no schema markup */}
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 list-none m-0 p-0">
          {FEATURES.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="group relative flex flex-col items-center text-center bg-[#f1f1f1] px-4 pt-6 pb-5 border-b-[3px] border-[#98022e] transition-all duration-300 hover:bg-[#98022e] hover:border-black hover:-translate-y-1 cursor-pointer hover:rounded-xl"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110">
                <Icon
                  size={20}
                  strokeWidth={1.75}
                  className="text-[#98022e] transition-colors duration-200"
                  aria-hidden="true"
                />
              </div>

              <h3 className="font-sarabun text-gray-800 text-[12px] mb-1 transition-all duration-200 group-hover:text-white font-bold">
                {title}
              </h3>

              <p className="font-hind-madurai text-gray-500 text-xs leading-snug max-w-[150px] transition-colors duration-200 group-hover:text-white/80">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WhyChooseUs;