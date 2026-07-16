import React from 'react'
import ProductsMain from './ProductsMain';
import ProductsHeader from '@/app/components/TittleAndBreadcrumb';
import ProductViewTabs from '@/app/components/ProductViewsTabs';
import NewsletterSection from '@/app/components/NewsletterSection';

const ProductsClient = () => {
  return (
    <div>
      <ProductsHeader/>
    <ProductsMain/>
    <ProductViewTabs/>
    <NewsletterSection/>
    </div>
  )
}

export default ProductsClient;
