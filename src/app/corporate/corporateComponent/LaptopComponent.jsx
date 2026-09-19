"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";

/**
 * LaptopComponent
 * ------------------------------------------------------------------
 * A 3D "360" carousel of laptop mockup screenshots, styled to match
 * the DC Wine & Spirits corporate page (white background, no visible
 * arrow/dot controls — navigation is by drag/swipe + autoplay).
 *
 * Per-slide sequence:
 *   1. Slide becomes active; its caption fades in above the stage.
 *   2. The slide holds (holdDuration) so the viewer has time to read
 *      both the image and the caption before advancing.
 *   3. Autoplay pauses entirely while the user is dragging or
 *      hovering the stage, so they can linger as long as they like.
 *
 * Usage:
 *   <LaptopComponent
 *     images={[
 *       {
 *         src: "/corporate/Laptop/laptop03.png",
 *         alt: "My Account page",
 *         text: "Manage every order from one simple account.",
 *       },
 *       {
 *         src: "/corporate/Laptop/laptop02.png",
 *         alt: "Wine & Champagne Gifts",
 *         text: "Curated wine & champagne gifts, delivered same day.",
 *       },
 *     ]}
 *   />
 *
 * Image paths are resolved from the `public` folder (Next.js convention).
 * No extra npm packages required.
 * ------------------------------------------------------------------
 */

const ACCENT = "#98022e";

const DEFAULT_IMAGES = [
  {
    src: "/corporate/Laptop/laptop02.png",
    alt: "Slide 1",
    text: "Curated wine & champagne gifts, delivered same day.",
  },
  {
    src: "/corporate/Laptop/catalog.png",
    alt: "Slide 2",
    text: "Over 1,200 bottles and gifts to choose from — a cellar this deep, at your fingertips.",
  },
  {
    src: "/corporate/Laptop/laptop03.png",
    alt: "Slide 3",
    text: "Real people, ready to help — right when you need them.",
  },
];

// Drag sensitivity: how many degrees of rotation per full stage-width swipe.
const DRAG_DEGREES_PER_STAGE_WIDTH = 180;
// Fallback stage width (px) used only if the ref isn't measured yet.
const FALLBACK_STAGE_WIDTH = 800;

export default function LaptopComponent({
  images = DEFAULT_IMAGES,
  autoPlay = true,
  radius = 480, // px — depth of the 3D ring
  holdDuration = 3800, // ms — how long each slide stays up before advancing
}) {
  // Guard against a bad/empty prop instead of crashing on division by zero.
  const slides = Array.isArray(images) && images.length > 0 ? images : DEFAULT_IMAGES;
  const count = slides.length;
  const angleStep = useMemo(() => 360 / count, [count]);

  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [captionVisible, setCaptionVisible] = useState(false);

  const dragState = useRef({ startX: 0, startRotation: 0 });
  const stageRef = useRef(null);

  // All pending timers live here so a single cleanup function can always
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

  // ---------- navigation ----------
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

  // ---------- caption fade-in whenever the active slide changes ----------
  useEffect(() => {
    setCaptionVisible(false);
    const fadeInTimer = setTimeout(() => setCaptionVisible(true), 120);
    trackTimer(fadeInTimer);
    return () => clearTimeout(fadeInTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // ---------- autoplay: hold on the slide, then advance ----------
  useEffect(() => {
    if (!shouldAutoAdvance) return;

    const advanceTimer = setTimeout(goNext, holdDuration);
    trackTimer(advanceTimer);

    return () => clearTimeout(advanceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoAdvance, holdDuration, goNext, activeIndex]);

  // Final safety net: clear every timer on unmount.
  useEffect(() => clearPendingTimers, []);

  // ---------- drag / swipe to rotate ----------
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

  const activeCaption = slides[activeIndex]?.text || "";

  return (
    <section className="w-full bg-[#eeeeee] py-16">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center px-6">
        {/* caption — simple, bold, fades in per slide */}
        <div
          className="mb-6 flex w-full max-w-[720px] min-h-[3.5em] items-center justify-center text-center"
          aria-live="polite"
        >
          <p
            className="font-hind-madurai"
            style={{
              color: ACCENT,
              fontWeight: 800,
              fontSize: "clamp(1.15rem, 2.5vw, 2rem)",
              lineHeight: 1.4,
              letterSpacing: "0.01em",
              opacity: captionVisible ? 1 : 0,
              transform: captionVisible ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 450ms ease, transform 450ms ease",
            }}
          >
            {activeCaption}
          </p>
        </div>

        {/* 3D rotating stage */}
        <div
          ref={stageRef}
          tabIndex={0}
          role="region"
          aria-label="Website preview carousel — drag to rotate"
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
          className="relative w-full outline-none"
          style={{
            height: "clamp(240px, 34vw, 420px)",
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
            {slides.map((img, i) => {
              const slideAngle = i * angleStep;
              const isActive = i === activeIndex;
              return (
                <div
                  key={`${img.src}-${i}`}
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
                    src={img.src}
                    alt={img.alt || `Slide ${i + 1}`}
                    draggable={false}
                    className="h-full w-auto max-w-full object-contain"
                    style={{
                      filter: isActive
                        ? "drop-shadow(0 18px 30px rgba(152,2,46,0.12))"
                        : "none",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}