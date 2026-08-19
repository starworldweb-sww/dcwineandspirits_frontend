import React, { Suspense } from 'react';
import OrderInfoClient from './OrderInfoClient';
import { Loader2 } from 'lucide-react';

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