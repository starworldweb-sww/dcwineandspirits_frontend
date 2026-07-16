import React from "react";
import HeroPic from "./components/HeroPic";
import GiftsByOccasionHero from "./components/GiftsByOccasionHero";
import HomeProductSlider from "./components/HomeProductSlider";
import ShopByBrand from "./components/ShopByBrands";
import BulkOrderBanner from "./components/BulkOrderBanner";
import HomepageSeoSection from "./components/HomepageSeoSection";
import ProductViewTabs from "./components/ProductViewsTabs";
import NewsletterSection from "./components/NewsletterSection";
import CategoryShowcase from "./components/categoryShowcase/CategoryShowcase";
import OccasionBar from "./components/navcomponents/OccasionsBar";

const page = () => {
  return (
    <>
      <div className="bg-white">
         <OccasionBar/> 
        <HeroPic />
        <CategoryShowcase />
        <GiftsByOccasionHero />
        <HomeProductSlider />

        <ShopByBrand />
        <BulkOrderBanner />
        <HomepageSeoSection />
        <ProductViewTabs />
        <NewsletterSection />
      </div>
    </>
  );
};

export default page;
