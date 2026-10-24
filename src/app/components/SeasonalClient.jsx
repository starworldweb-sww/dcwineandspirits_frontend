"use client";

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaGlassCheers, FaArrowRight } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi2'
import { SEASONAL_PRODUCTS } from '@/libs/seasonalProducts';

const HOLIDAY_LINK = '/holiday-gift-basket/' 

// ============================================================
// Image placeholder
// Builds a shimmering SVG used as a blur placeholder while images load.
// ============================================================
const shimmer = (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3f1ea" offset="20%" />
      <stop stop-color="#e8e4d8" offset="50%" />
      <stop stop-color="#f3f1ea" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3f1ea" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
</svg>`

// Buffer on the server, btoa in the browser.
const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

const shimmerDataURL = (w, h) => `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`

// ============================================================
// Snow effect (canvas)
//
// Stacking order inside the hero (the hero uses `isolate`, so these
// z-indexes stay local): snow (1) < lights / sparkles / star (2) < heading (3).
//
// Depth: flakes are split into dot / crystal / bokeh layers, with a light
// mouse parallax. Wind: a gentle base breeze plus a gust roughly every
// 10 seconds that alternates direction. Closer flakes react more strongly.
// ============================================================
const SnowCanvas = ({ count = 110 }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // Skip the animation entirely for users who prefer reduced motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    const parent = canvas.parentElement
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let w = 0
    let h = 0
    let raf = 0
    let t = 0
    let flakes = []
    let hover = false
    let target = 0
    let shift = 0

    // `initial` spreads the first batch across the canvas;
    // recycled flakes always respawn just above the top edge.
    const makeFlake = (initial) => {
      const depth = Math.random()
      const d2 = depth * depth
      const type = depth > 0.94 ? 'bokeh' : depth > 0.82 ? 'crystal' : 'dot'
      return {
        type,
        depth,
        x: Math.random() * w,
        y: initial ? Math.random() * h : -20,
        vx: 0,
        r: type === 'bokeh' ? 7 + Math.random() * 5 : 0.8 + d2 * 5.5,
        speed: 0.2 + depth * 1.1,
        opacity: type === 'bokeh' ? 0.22 : 0.3 + depth * 0.6,
        phase: Math.random() * Math.PI * 2,
        sway: 0.3 + Math.random() * 0.7,
        swaySpeed: 0.008 + Math.random() * 0.012,
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        tilt: Math.random() * Math.PI,
        tiltSpeed: 0.02 + Math.random() * 0.03,
      }
    }

    // Keeps the canvas in sync with its container and scales the flake count with width.
    const resize = () => {
      const rect = parent.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const n = Math.max(40, Math.round((count * w) / 1200))
      if (flakes.length > n) flakes = flakes.slice(0, n)
      while (flakes.length < n) flakes.push(makeFlake(true))
    }

    // Soft dot; draws a short motion streak when the wind is strong.
    const drawDot = (x, y, f, streak) => {
      if (streak > 0.6 && f.depth > 0.25) {
        ctx.strokeStyle = `rgba(255,255,255,${f.opacity * 0.45})`
        ctx.lineWidth = Math.max(0.6, f.r * 0.9)
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x - f.vx * 3.2, y - f.speed * 2)
        ctx.lineTo(x, y)
        ctx.stroke()
      }
      const g = ctx.createRadialGradient(x, y, 0, x, y, f.r)
      g.addColorStop(0, `rgba(255,255,255,${f.opacity})`)
      g.addColorStop(0.5, `rgba(255,255,255,${f.opacity * 0.6})`)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, f.r, 0, Math.PI * 2)
      ctx.fill()
    }

    // Large, faint out-of-focus flake in the foreground.
    const drawBokeh = (x, y, f) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, f.r)
      g.addColorStop(0, `rgba(255,255,255,${f.opacity})`)
      g.addColorStop(0.65, `rgba(255,255,255,${f.opacity * 0.55})`)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, f.r, 0, Math.PI * 2)
      ctx.fill()
    }

    // Six-armed crystal; horizontal scaling by `tilt` fakes a 3D flip.
    const drawCrystal = (x, y, f) => {
      const r = f.r
      const sx = 0.25 + 0.75 * Math.abs(Math.cos(f.tilt))
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(f.rot)
      ctx.scale(sx, 1)
      ctx.strokeStyle = `rgba(255,255,255,${f.opacity})`
      ctx.lineWidth = Math.max(0.8, r * 0.18)
      ctx.lineCap = 'round'
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        ctx.save()
        ctx.rotate((i * Math.PI) / 3)
        ctx.moveTo(0, 0)
        ctx.lineTo(r, 0)
        ctx.moveTo(r * 0.55, 0)
        ctx.lineTo(r * 0.8, r * 0.25)
        ctx.moveTo(r * 0.55, 0)
        ctx.lineTo(r * 0.8, -r * 0.25)
        ctx.restore()
      }
      ctx.stroke()
      ctx.restore()
    }

    // One gust cycle takes roughly 10 seconds at 60fps.
    const GUST_SPEED = 0.0105
    const GUST_POWER = 3.2

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      t += 1

      // Parallax follows the pointer while hovering, otherwise drifts slowly.
      const goal = hover ? target : Math.sin(t * 0.003) * 0.5
      shift += (goal - shift) * 0.05

      // Gust direction flips on every cycle.
      const cycle = t * GUST_SPEED
      const dir = Math.floor(cycle / (Math.PI * 2)) % 2 === 0 ? 1 : -1
      const gust = Math.pow(Math.max(0, Math.sin(cycle)), 3) * GUST_POWER * dir
      const wind = Math.sin(t * 0.004) * 0.35 + gust

      for (const f of flakes) {
        f.phase += f.swaySpeed
        const windTarget = wind * (0.35 + f.depth * 0.9)
        f.vx += (windTarget - f.vx) * 0.05

        f.x += Math.sin(f.phase) * f.sway * 0.6 + f.vx
        f.y += f.speed
        f.rot += f.rotSpeed + f.vx * 0.004
        f.tilt += f.tiltSpeed

        // Recycle flakes that fell out of view and wrap them horizontally.
        if (f.y - f.r * 2 > h) Object.assign(f, makeFlake(false))
        if (f.x < -30) f.x = w + 30
        if (f.x > w + 30) f.x = -30

        const px = f.x + shift * f.depth * 22

        if (f.type === 'bokeh') drawBokeh(px, f.y, f)
        else if (f.type === 'crystal') drawCrystal(px, f.y, f)
        else drawDot(px, f.y, f, Math.abs(f.vx))
      }

      raf = requestAnimationFrame(draw)
    }

    const onMove = (e) => {
      const rect = parent.getBoundingClientRect()
      target = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      hover = true
    }
    const onLeave = () => {
      hover = false
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    parent.addEventListener('pointermove', onMove, { passive: true })
    parent.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      parent.removeEventListener('pointermove', onMove)
      parent.removeEventListener('pointerleave', onLeave)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
    />
  )
}

// ============================================================
// Fairy lights (twinkle + wind swing)
// Bulb positions are derived from the same quadratic curve as the wire,
// so every bulb sits exactly on it.
// ============================================================
const LIGHTS_H = 18
const SAG = 8
const SWAGS = 7
const BULB_POSITIONS = [0.16, 0.5, 0.84]
const BULB_COLORS = ['#ff4d5a', '#ffd45a', '#3ddc84', '#ffffff']

const LIGHT_BULBS = Array.from({ length: SWAGS * BULB_POSITIONS.length }, (_, i) => {
  const seg = Math.floor(i / BULB_POSITIONS.length)
  const u = BULB_POSITIONS[i % BULB_POSITIONS.length]
  return {
    id: i,
    left: `${((seg + u) / SWAGS) * 100}%`,
    top: 4 * SAG * u * (1 - u),
    color: BULB_COLORS[i % BULB_COLORS.length],
    delay: (i % 4) * 0.55,
    swingDuration: 3 + (i % 5) * 0.45,
  }
})

const swagPath = Array.from({ length: SWAGS }, (_, s) => {
  const x0 = (s / SWAGS) * 100
  const x1 = ((s + 1) / SWAGS) * 100
  const mid = (x0 + x1) / 2
  return `${s === 0 ? `M${x0},0 ` : ''}Q${mid},${SAG * 2} ${x1},0`
}).join(' ')

const FairyLights = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 top-0 z-[2]"
    style={{ height: LIGHTS_H }}
  >
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={`0 0 100 ${LIGHTS_H}`}
      preserveAspectRatio="none"
    >
      <path
        d={swagPath}
        fill="none"
        stroke="rgba(20,20,20,0.8)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>

    {LIGHT_BULBS.map((b) => (
      <span
        key={b.id}
        className="absolute block -translate-x-1/2"
        style={{ left: b.left, top: b.top }}
      >
        <span
          className="xmas-bulb block h-[9px] w-[6px] rounded-full md:h-[11px] md:w-[7px]"
          style={{
            backgroundColor: b.color,
            color: b.color,
            animationDelay: `${b.delay}s, ${b.delay}s`,
            animationDuration: `2.1s, ${b.swingDuration}s`,
          }}
        />
      </span>
    ))}
  </div>
)

// ============================================================
// Gold sparkles and shooting star
// ============================================================
const SPARKLES = [
  { left: '7%', top: '30%', size: 14, delay: 0 },
  { left: '28%', top: '22%', size: 10, delay: 1.2 },
  { left: '73%', top: '26%', size: 12, delay: 0.6 },
  { left: '92%', top: '38%', size: 9, delay: 1.8 },
]

const Sparkles = () => (
  <>
    {SPARKLES.map((s, i) => (
      <HiSparkles
        key={i}
        aria-hidden="true"
        className="pointer-events-none absolute z-[2] text-[#f0c36a] animate-[twinkle_2.6s_ease-in-out_infinite]"
        style={{
          left: s.left,
          top: s.top,
          width: s.size,
          height: s.size,
          animationDelay: `${s.delay}s`,
        }}
      />
    ))}

    <span
      aria-hidden="true"
      className="shooting-star pointer-events-none absolute left-[-6%] top-[18%] z-[2] h-px w-20 bg-gradient-to-r from-transparent via-white/70 to-white md:w-28"
    />
  </>
)

// ============================================================
// Product card
// Product data is static and lives in @/libs/seasonalProducts.
// Fields used here: slug, name, image
// ============================================================
const WeddingProductCard = ({ product }) => {
  return (
    <Link
      href={`/${product.slug}`}
      aria-label={`View ${product.name}`}
      className="group flex flex-col overflow-hidden rounded-none border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#98022e]"
    >
      <div className="relative aspect-square w-full bg-[#f9f9f9]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={shimmerDataURL(400, 400)}
        />

        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm">
          <FaGlassCheers className="h-3.5 w-3.5 text-[#98022e]" />
        </span>
      </div>

      <div className="px-3 py-3">
        <p className="font-sumana text-[13px] font-medium leading-snug text-[#333] line-clamp-2">
          {product.name}
        </p>
      </div>
    </Link>
  )
}

// ============================================================
// Main component
// ============================================================
const SeasonalClient = () => {
  const products = SEASONAL_PRODUCTS

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Hero. `isolate` keeps the inner z-indexes from leaking outside. */}
      <div className="relative isolate h-[180px] w-full overflow-hidden md:h-[210px]">
        <Image
          src="/holiday_homepage.png"
          alt="Holiday-Gift-Baskets-Dc-Wine-&-Spirits"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={shimmerDataURL(1600, 400)}
        />

        {/* Overlay 1: light dark tint across the hero to keep the heading readable. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/30" />

        {/* Overlay 2: brand-colour (maroon) gradient rising from the bottom. */}
        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[#98022e] via-[#98022e]/50 to-transparent" />

        {/* Overlay 3: white fade so the hero blends into the page background.
            Multiple stops keep the transition smooth; the bottom edge is exactly
            #fff to match the section background. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-px h-[40%] bg-[linear-gradient(to_top,#fff_0%,rgba(255,255,255,0.9)_18%,rgba(255,255,255,0.55)_50%,rgba(255,255,255,0.15)_80%,rgba(255,255,255,0)_100%)] md:h-[42%]"
        />

        <SnowCanvas count={110} />
        <FairyLights />
        <Sparkles />

        {/* Heading, aligned to the top so it stays clear of the white fade. */}
        <div className="absolute inset-0 z-[3] flex flex-col items-center justify-start px-3 pt-9 text-center md:pt-11 2xl:px-32">
          {/* Caveat renders smaller than Sumana at the same size, hence the 1.25em bump. */}
          <h2 className="max-w-full font-sumana text-[clamp(1.1rem,4.6vw,1.875rem)] font-bold leading-tight tracking-tight text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.6)]">
            <span className="block text-[1.25em] font-bold tracking-normal font-[family-name:var(--font-caveat)] md:inline">
              Holiday Gifting Starts Here.
            </span>
          </h2>

          <p className="mt-2 max-w-xl font-hind-madurai text-sm text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.6)] md:text-base">
            Wine, champagne &amp; spirits gift sets, wrapped with cheer.
          </p>
        </div>
      </div>

      {/* Product grid, hidden if the list is empty. */}
      {products.length > 0 && (
        <div
          id="wedding-season-products"
          className="relative mx-auto flex max-w-6xl scroll-mt-4 snap-x snap-mandatory gap-4 overflow-x-auto px-3 pb-8 pt-4 no-scrollbar md:grid md:grid-cols-4 md:gap-6 md:overflow-visible 2xl:px-32"
        >
          {products.map((product) => (
            <div
              key={product.slug}
              className="w-[44%] flex-shrink-0 snap-start sm:w-[calc(50%-8px)] md:w-full"
            >
              <WeddingProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Call to action */}
      <div className="relative mx-auto max-w-6xl px-3 pb-10 text-center 2xl:px-32">
        <Link
          href={HOLIDAY_LINK}
          className="group inline-flex items-center gap-2 border border-[#98022e] bg-[#98022e] px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:rounded-xl active:scale-95"
        >
          VIEW ALL
        </Link>
      </div>

      {/* Keyframes: twinkle (sparkles), bulbTwinkle + bulbSwing (lights), shootingStar */}
      <style jsx global>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        .xmas-bulb {
          box-shadow: 0 0 6px 2px currentColor;
          transform-origin: 50% 0;
          animation:
            bulbTwinkle 2.1s ease-in-out infinite,
            bulbSwing 3.6s ease-in-out infinite;
        }

        @keyframes bulbTwinkle {
          0%,
          100% {
            opacity: 1;
            box-shadow: 0 0 8px 3px currentColor;
          }
          50% {
            opacity: 0.45;
            box-shadow: 0 0 3px 1px currentColor;
          }
        }

        @keyframes bulbSwing {
          0%,
          100% {
            transform: rotate(-9deg);
          }
          50% {
            transform: rotate(9deg);
          }
        }

        .shooting-star {
          opacity: 0;
          animation: shootingStar 10s linear infinite;
        }

        @keyframes shootingStar {
          0%,
          72% {
            transform: translate3d(0, 0, 0) rotate(10deg);
            opacity: 0;
          }
          74% {
            opacity: 1;
          }
          88%,
          100% {
            transform: translate3d(70vw, 45px, 0) rotate(10deg);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .xmas-bulb {
            animation: none;
          }
          .shooting-star {
            display: none;
          }
        }
      `}</style>
    </section>
  )
}

export default SeasonalClient