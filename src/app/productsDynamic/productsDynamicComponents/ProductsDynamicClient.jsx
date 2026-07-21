import React from "react";
import Filters from "./Filters";
import ProductsDynamicMain from "./ProductsDynamicMain";

const ProductsDynamicClient = () => {
  return (
    <div className='2xl:px-32 flex items-start justify-between gap-6'>
    <Filters/>
    <ProductsDynamicMain/>
     
     </div>
  );
};

export default ProductsDynamicClient;