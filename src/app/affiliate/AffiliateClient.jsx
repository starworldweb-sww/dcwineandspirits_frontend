import React from "react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { Handshake } from "lucide-react";

const breadcrumbs = [{ label: "Affiliate", href: "/affiliate" }];

const AffiliateClient = () => {
  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="Affiliate Program" breadcrumbs={breadcrumbs} />

      <div className="w-full px-3 lg:px-3 2xl:px-32 py-24 flex flex-col items-center justify-center text-center">
        <Handshake size={48} className="text-[#8c1a3c] mb-5" />
        <h2 className="text-[22px] font-hind-madurai font-semibold text-[#333333] mb-2">
          Affiliate Program – Coming Soon
        </h2>
        <p className="text-[14px] font-hind-madurai text-[#666666] max-w-[420px]">
          We are building a rewarding affiliate experience. Stay tuned for updates and partnership opportunities.
        </p>
      </div>
    </div>
  );
};

export default AffiliateClient;