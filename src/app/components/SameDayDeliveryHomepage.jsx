import React from 'react'
import Link from 'next/link'

const SAME_DAY_AREAS = [
  { name: 'DC', slug: 'wine-delivery-dc/' },
  { name: 'VA', slug: 'wine-basket-delivery-va/' },
  { name: 'LA', slug: 'los-angeles/' },
]
const NEXT_DAY_AREAS = [
  { name: 'NY', slug: 'wine-basket-delivery-ny/' },
  { name: 'NJ', slug: 'wine-basket-delivery-nj/' },
  { name: 'MD', slug: 'wine-basket-delivery-md/' },
  { name: 'CT', slug: 'wine-basket-delivery-ct/' },
  { name: 'PA', slug: 'wine-basket-delivery-philadelphia-pa/' },
  { name: 'MA', slug: 'wine-basket-delivery-ma/' },
]

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true">
    <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
  </svg>
)

const TruckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3 h-3 sm:w-3.5 sm:h-3.5"
    aria-hidden="true"
  >
    <path d="M1 3h13v13H1z" />
    <path d="M14 8h4l4 4v4h-8z" />
    <circle cx="5.5" cy="18.5" r="2" />
    <circle cx="18.5" cy="18.5" r="2" />
  </svg>
)

const DeliverySection = ({ label, areas, icon, solid }) => (
  <div
    className="flex-1 min-w-0 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3"
    style={{ fontFamily: '"Hind Madurai", sans-serif' }}
  >
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 border border-[#98022e] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-[0.18em] whitespace-nowrap ${
        solid ? 'bg-[#98022e]' : 'bg-transparent'
      }`}
    >
      <span className="hidden sm:inline-flex">{icon}</span>
      {label}
    </span>

    <span className="sm:hidden max-w-full truncate text-white/90 text-[11px] min-[400px]:text-xs font-medium tracking-wide leading-none">
      {areas.map((area, index) => (
        <React.Fragment key={area.name}>
          {index > 0 && ' · '}
          <Link href={`/${area.slug}`}>{area.name}</Link>
        </React.Fragment>
      ))}
    </span>

    <div className="hidden sm:flex items-center gap-1.5">
      {areas.map((area) => (
        <Link
          key={area.name}
          href={`/${area.slug}`}
          className="px-2 py-0.5 rounded border border-white/20 bg-white/5 text-white text-xs font-semibold tracking-wide"
        >
          {area.name}
        </Link>
      ))}
    </div>
  </div>
)

const SameDayDeliveryHomepage = () => {
  return (
    <div className="w-full lg:px-3 2xl:px-32">
      <section className="w-full h-[60px] mt-3 sm:mt-4 flex items-center overflow-hidden border-y lg:border border-[#98022e]/70 lg:rounded-md bg-gradient-to-r from-black via-[#2a0010] to-black">
        <div className="w-full px-3 lg:px-6 flex items-center">
          <DeliverySection label="Same Day Delivery" areas={SAME_DAY_AREAS} icon={<BoltIcon />} solid />
          <span className="h-8 w-px bg-white/20 shrink-0" aria-hidden="true" />
          <DeliverySection label="Next Day Delivery" areas={NEXT_DAY_AREAS} icon={<TruckIcon />} solid />
        </div>
      </section>
    </div>
  )
}

export default SameDayDeliveryHomepage