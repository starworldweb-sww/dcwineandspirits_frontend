
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





const HomePageClient = () => {


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
        <HomepageSeoSection/>
        
        <ProductViewTabs />
      </div>
    </>
  );
};

export default HomePageClient;