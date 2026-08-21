import React, { Suspense } from 'react';
import OrderInfoClient from './OrderInfoClient';
import { Loader2 } from 'lucide-react';


export const metadata = {
  title: "Order Information",
  description:
    "Shop at DC Wine & Spirits wide selection of wine and champagne gifts. Visit our online store for fast delivery, great prices & best customer service in USA.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/account/order/info/",
  },
};


const Page = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-[#8c1a3c]" size={40} />
      </div>
    }>
      <OrderInfoClient />
    </Suspense>
  );
};

export default Page;