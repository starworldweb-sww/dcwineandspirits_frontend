import React from 'react'
import Link from 'next/link'

const CorporateNow = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/corporate/corporateTableDcWine.png')" }}
      />
      {/* Left fade (image jaisa soft white gradient) */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/10 to-transparent" />

      <div className="relative mx-auto max-w-[1400px] px-4 py-10 md:px-18 md:py-20">
        {/* Text box */}
        <div className="w-full max-w-[620px] rounded-xl bg-[#eeeeee] px-6 py-8 shadow-md md:px-12 md:py-10">
          <h3 className="font-sarabun text-2xl font-bold uppercase italic text-[#98022e] md:text-4xl">
            Grab the deal
          </h3>

          <p className="mt-2 font-sarabun text-2xl font-bold italic text-[#1c1f22] md:text-4xl">
            Up to <span className="text-[#98022e]">15% off</span> on bulk orders
          </p>

          <p className="mt-4 font-hind-madurai text-lg italic text-[#1c1f22] md:text-2xl">
            Valid until 31st Oct
          </p>

          <a
          download={"bulk-order-form.xlsx"}
            href='/bulk-order-form.xlsx'
            className="mt-8 inline-block border-b border-[#1c1f22] pb-1 text-sm uppercase tracking-[0.25em] text-[#1c1f22] transition-colors hover:border-[#7a0225] hover:text-[#7a0225]"
          >
            Order now
          </a>
        </div>
      </div>
    </section>
  )
}

export default CorporateNow