import React from "react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { PackageSearch } from "lucide-react";

const breadcrumbs = [{ label: "Track Order", href: "/track-order" }];

const TrackClient = () => {
  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="Track Order" breadcrumbs={breadcrumbs} />

      <div className="w-full px-3 lg:px-3 2xl:px-32 py-24 flex flex-col items-center justify-center text-center">
        <PackageSearch size={48} className="text-[#8c1a3c] mb-5" />
        <h2 className="text-[22px] font-hind-madurai font-semibold text-[#333333] mb-2">
          This Page is Under Development
        </h2>
        <p className="text-[14px] font-hind-madurai text-[#666666] max-w-[420px]">
          We're building a seamless order tracking experience. Please check back soon.
        </p>
      </div>
    </div>
  );
};

export default TrackClient;