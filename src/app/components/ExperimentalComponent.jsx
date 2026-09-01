import React from 'react'
import Link from 'next/link'
import { ChevronRight, MapPin, Tag, Globe, Gift } from 'lucide-react'

const cards = [
  {
    eyebrow: 'DELIVERY',
    title: 'Locations We Serve',
    subtitle: 'Check delivery availability in your area',
    icon: MapPin,
    href: '/wine-delivery/',
  },
  {
    eyebrow: 'PRICE',
    title: 'Shop by Price',
    subtitle: 'Find bottles within your budget',
    icon: Tag,
    href: '/shop-by-price/',
  },
  {
    eyebrow: 'ORIGIN',
    title: 'Shop by Origin',
    subtitle: 'Explore wines by country',
    icon: Globe,
    href: '/gifts-by-origin/',
  },
  {
    eyebrow: 'RECIPIENT',
    title: 'Gifts By Recipient',
    subtitle: 'Find the perfect gift for anyone',
    icon: Gift,
    href: '/recipients/',
  },
]

const ExperimentalComponent = () => {
  return (
    <div className="w-full bg-white py-4">
      <div className="grid grid-cols-2 gap-3 px-3 sm:grid-cols-2 lg:grid-cols-4 2xl:px-32">
        {cards.map((card, i) => {
          const isMobileVisible =
            card.title === 'Shop by Price' || card.title === 'Shop by Origin'
          const Icon = card.icon
          return (
            <Link
              key={i}
              href={card.href}
              className={`
                group flex flex-row items-center gap-2.5 overflow-hidden rounded-lg 
                border border-gray-200 bg-white px-2.5 py-2 transition-all 
                duration-200 hover:border-[#98022e]/40 hover:shadow-sm cursor-pointer
                active:scale-95 active:opacity-80
                sm:gap-3 sm:px-3.5 sm:py-2.5
                ${!isMobileVisible ? 'hidden sm:flex' : ''}
              `}
            >
              {/* Mobile pe icon circle chhota (h-7/w-7, icon 14px) rakha hai
                  taaki card ki height kam ho jaaye — sm aur usse upar
                  original size (h-10/w-10, icon 18px) hi rehta hai */}
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#98022e]/10 sm:h-10 sm:w-10">
                <Icon size={14} className="text-[#98022e] sm:size-[18px]" strokeWidth={2} />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="truncate whitespace-nowrap text-xs font-semibold text-gray-900 sm:whitespace-normal sm:text-sm sm:line-clamp-1">
                  {card.title}
                </p>
                <p className="hidden truncate font-hind-madurai text-xs text-gray-400 sm:block">
                  {card.subtitle}
                </p>
              </div>

              <ChevronRight
                size={16}
                className="shrink-0 text-gray-300 transition-colors duration-200 group-hover:text-[#98022e]"
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default ExperimentalComponent