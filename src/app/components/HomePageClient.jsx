"use client"
import React from "react";
import OccasionBar from "./navcomponents/OccasionsBar";
import CategoryShowcase from "./categoryShowcase/CategoryShowcase";
import HomeProductSlider from "./HomeProductSlider";
import ShopByBrand from "./ShopByBrands";
import BulkOrderBanner from "./BulkOrderBanner";
import HomepageSeoSection from "./HomepageSeoSection";
import ProductViewTabs from "./ProductViewsTabs";
import HeroPic from "./HeroPic";
import GiftsByOccasionHero from "./GiftsByOccasionHero";
import { useGetHomePageText } from "../api/hooks/category/useHomePageText";

// Import your newly created hook (adjust the path based on your folder structure)


const HomePageClient = () => {
  // Call the hook to get the SEO text data
  const { data: seoData, isLoading } = useGetHomePageText();

  return (
    <>
      <div className="bg-white">
        <OccasionBar /> 
        <HeroPic />
        <CategoryShowcase />
        <GiftsByOccasionHero />
        <HomeProductSlider />
        <ShopByBrand />
        <BulkOrderBanner />
        
        {/* Pass the fetched data and loading state to the SEO Section */}
        <HomepageSeoSection seoData={seoData} isLoading={isLoading} />
        
        <ProductViewTabs />
      </div>
    </>
  );
};

export default HomePageClient;