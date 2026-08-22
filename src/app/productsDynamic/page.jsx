import React, { Suspense } from 'react'
import ProductsDynamicClient from './productsDynamicComponents/ProductsDynamicClient'


const page = () => {
  return (
    <>
      <Suspense fallback={null}>
        <ProductsDynamicClient/>
      </Suspense>
    </>
  )
}

export default page