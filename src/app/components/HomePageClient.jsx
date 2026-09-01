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
import { useHomePageAllData } from "@/app/api/hooks/category/useHomePageAllData";
import { Loader2 } from "lucide-react";
import WhyChooseUs from "./WhyChooseUs";
import ExperimentalComponent from "./ExperimentalComponent";
import LoveBanner from "./LoveBanner";


const HomePageClient = () => {
  const { data: homeData, isLoading, isError } = useHomePageAllData();

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#98022e]" size={40} />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white">
        <OccasionBar data={homeData?.occasionMenu} isLoading={isLoading} isError={isError} />
        <HeroPic data={homeData?.homeTopBanner} isLoading={isLoading} isError={isError} />
        <ExperimentalComponent/>
        <CategoryShowcase data={homeData?.topCategories} isLoading={isLoading} isError={isError} />
        <LoveBanner data={homeData?.loveBanners}/>
        <GiftsByOccasionHero
          data={homeData?.giftByOccasion}
          bannersData={homeData?.loveBanners}
          isLoading={isLoading}
          isError={isError}
        />
        <HomeProductSlider data={homeData?.homePageProducts} isLoading={isLoading} isError={isError} />
        <ShopByBrand data={homeData?.shopByBrandTitle} isLoading={isLoading} isError={isError} />
        <BulkOrderBanner />

        <HomepageSeoSection data={homeData?.homePageText} isLoading={isLoading} isError={isError} />
        <WhyChooseUs/>
        
      </div>
    </>
  );
};

export default HomePageClient;
