"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";

/**
 * EngravedBottles
 * ------------------------------------------------------------------
 * DC Wine & Spirits ke liye "Engraved Bottles" section.
 *
 * Do parts hain:
 *   1. "How It Works" — 3 simple steps (Choose Bottle -> Add Message -> Deliver)
 *   2. 3D "360" rotating bottle carousel — LaptopComponent jaisa hi
 *      drag/swipe + autoplay mechanism, bas laptop images ki jagah
 *      engraved bottle images aur unka engraving text/price caption.
 *
 * Carousel ka kaam kaise karta hai (LaptopComponent se same pattern):
 *   - Har bottle ek 3D ring pe angleStep degrees apart rakhi hai
 *   - rotation state ring ko ghumati hai taaki active bottle front pe aa jaye
 *   - Autoplay har `holdDuration` ms baad next bottle pe move karta hai
 *   - User drag/hover kare to autoplay pause ho jata hai
 * ------------------------------------------------------------------
 */

const MAROON = "#98022e";
const GOLD = "#c99000";

// ================================================================
// 1. "HOW IT WORKS" STEPS DATA
// ================================================================
const ENGRAVING_STEPS = [
  {
    stepNumber: "01",
    title: "Choose Your Bottle",
    description:
      "Wine, champagne, whisky ya spirits — apni pasand ki bottle select karein.",
  },
  {
    stepNumber: "02",
    title: "Add Your Message",
    description:
      "Naam, date, ya koi bhi special message likhein jo bottle pe engrave karna hai.",
  },
  {
    stepNumber: "03",
    title: "We Engrave & Deliver",
    description:
      "Hamari team carefully engrave karke, safely packed bottle aapke doorstep tak pahunchati hai.",
  },
];

// ================================================================
// 2. ENGRAVED BOTTLES DATA (carousel slides)
// Har bottle: image, naam, price, aur engraving caption
// imageSrc ko apne actual product images ke path se replace karein
// ================================================================
const DEFAULT_BOTTLES = [
  {
    src: "/corporate/bottles/engravedbottle.png",
    alt: "Engraved Champagne Bottle",
    name: "Engraved Champagne Bottle",
    price: "$89.99",
    text: "Happy Anniversary, Sarah & Tom",
  },
  {
    src: "/corporate/bottles/engravedbottle02.png",
    alt: "Engraved Whisky Bottle",
    name: "Engraved Whisky Bottle",
    price: "$74.99",
    text: "To the Best Boss Ever",
  },
  {
    src: "/corporate/bottles/engravedbottle03.png",
    alt: "Engraved Red Wine Bottle",
    name: "Engraved Red Wine Bottle",
    price: "$59.99",
    text: "Congratulations on Your New Home",
  },

];

// Drag sensitivity: how many degrees of rotation per full stage-width swipe.
const DRAG_DEGREES_PER_STAGE_WIDTH = 180;
// Fallback stage width (px) used only if the ref isn't measured yet.
const FALLBACK_STAGE_WIDTH = 800;

export default function EngravedBottles({
  bottles = DEFAULT_BOTTLES,
  autoPlay = true,
  radius = 420, // px — depth of the 3D ring (laptop wale se thoda kam, bottle chhoti hoti hai)
  holdDuration = 3800, // ms — har bottle kitni der front pe ruki rahe
}) {
  // 3. Guard against a bad/empty prop instead of crashing on division by zero.
  const slides =
    Array.isArray(bottles) && bottles.length > 0 ? bottles : DEFAULT_BOTTLES;
  const count = slides.length;
  const angleStep = useMemo(() => 360 / count, [count]);

  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [captionVisible, setCaptionVisible] = useState(false);

  const dragState = useRef({ startX: 0, startRotation: 0 });
  const stageRef = useRef(null);

  // 4. All pending timers live here so a single cleanup function can always
  // find and clear them — avoids orphaned callbacks firing after the
  // slide (or component) has already changed.
  const pendingTimers = useRef([]);
  const clearPendingTimers = () => {
    pendingTimers.current.forEach(clearTimeout);
    pendingTimers.current = [];
  };
  const trackTimer = (id) => {
    pendingTimers.current.push(id);
    return id;
  };

  const shouldAutoAdvance = autoPlay && !isDragging && !isHovering && count > 1;

  // ---------- 5. navigation ----------
  const goTo = useCallback(
    (index) => {
      const normalized = ((index % count) + count) % count;
      setActiveIndex(normalized);
      setRotation(-normalized * angleStep);
    },
    [count, angleStep]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // ---------- 6. caption fade-in whenever the active slide changes ----------
  useEffect(() => {
    setCaptionVisible(false);
    const fadeInTimer = setTimeout(() => setCaptionVisible(true), 120);
    trackTimer(fadeInTimer);
    return () => clearTimeout(fadeInTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // ---------- 7. autoplay: hold on the slide, then advance ----------
  useEffect(() => {
    if (!shouldAutoAdvance) return;

    const advanceTimer = setTimeout(goNext, holdDuration);
    trackTimer(advanceTimer);

    return () => clearTimeout(advanceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoAdvance, holdDuration, goNext, activeIndex]);

  // Final safety net: clear every timer on unmount.
  useEffect(() => clearPendingTimers, []);

  // ---------- 8. drag / swipe to rotate ----------
  const getClientX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  const handlePointerDown = (e) => {
    if (count <= 1) return;
    setIsDragging(true);
    dragState.current = { startX: getClientX(e), startRotation: rotation };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = getClientX(e) - dragState.current.startX;
    const stageWidth = stageRef.current?.offsetWidth || FALLBACK_STAGE_WIDTH;
    const deltaDeg = (deltaX / stageWidth) * DRAG_DEGREES_PER_STAGE_WIDTH;
    setRotation(dragState.current.startRotation + deltaDeg);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const nearestIndex = Math.round(-rotation / angleStep);
    goTo(nearestIndex);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };

  const active = slides[activeIndex] || {};

  return (
    <section className="w-full bg-white py-14 md:py-16 lg:py-20 font-hind-madurai px-3 2xl:px-32">
      <div className="max-w-[1400px] mx-auto">
        {/* ============ 9. SECTION HEADING ============ */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-sumana text-3xl md:text-4xl lg:text-[44px] font-bold text-[#1c1f22] leading-tight">
            <span className="italic font-bold text-[#98022e]" >
              Engraved{" "}
            </span>
            Bottles
          </h2>

          <p className="italic text-sm md:text-base text-[#4a4a4a] max-w-2xl mx-auto mt-4">
            Want to add a personal touch to your gift? Etch a name, a date,
            or a company crest directly into the glass of any wine or
            champagne bottle. We'll engrave, pack, and ship it for you — no
            separate order to manage.
          </p>
        </div>

        
       

        {/* ============ 11. 3D 360 ROTATING BOTTLE CAROUSEL ============ */}
        <div className="flex w-full flex-col items-center">
          {/* caption — bottle name + price + engraving text, fades in per slide */}
          

          {/* 3D rotating stage */}
          <div
            ref={stageRef}
            tabIndex={0}
            role="region"
            aria-label="Engraved bottles carousel — drag to rotate"
            onKeyDown={handleKeyDown}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={() => {
              handlePointerUp();
              setIsHovering(false);
            }}
            onMouseEnter={() => setIsHovering(true)}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            className="relative w-full max-w-[1000px] outline-none"
            style={{
              height: "clamp(280px, 38vw, 460px)",
              perspective: "1600px",
              cursor: count > 1 ? (isDragging ? "grabbing" : "grab") : "default",
              touchAction: "pan-y",
            }}
          >
            {/* soft contact shadow under the ring */}
            <div
              className="absolute left-[8%] right-[8%] -bottom-2 h-10 rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0) 70%)",
                filter: "blur(2px)",
              }}
            />

            <div
              className="absolute inset-0"
              style={{
                transformStyle: "preserve-3d",
                transform: `translateZ(-${radius}px) rotateY(${rotation}deg)`,
                transition: isDragging
                  ? "none"
                  : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {slides.map((bottle, i) => {
                const slideAngle = i * angleStep;
                const isActive = i === activeIndex;
                return (
                  <div
                    key={`${bottle.src}-${i}`}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: `rotateY(${slideAngle}deg) translateZ(${radius}px)`,
                      opacity: isActive ? 1 : 0.3,
                      filter: isActive
                        ? "brightness(1) saturate(1)"
                        : "brightness(0.7) saturate(0.8)",
                      transition: "opacity 700ms ease, filter 700ms ease",
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <img
                      src={bottle.src}
                      alt={bottle.alt || bottle.name || `Slide ${i + 1}`}
                      draggable={false}
                      className="h-full w-auto max-w-full object-contain"
                      style={{
                        filter: isActive
                          ? "drop-shadow(0 18px 30px rgba(152,2,46,0.18))"
                          : "none",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

         
        </div>

        {/* ============ 13. CTA BUTTON ============ */}
        <div className="text-center mt-12 md:mt-14">
          <Link
            href={"/engraved-champagne-bottles/"}
            
            className="inline-block px-8 py-3 rounded-full font-sumana font-bold text-white text-sm md:text-base tracking-wide transition-transform duration-200 hover:scale-105 cursor-pointer"
            style={{ backgroundColor: MAROON }}
          >
            Shop All Engraved Bottles
          </Link>
        </div>
      </div>
    </section>
  );
}