"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const MAROON = "#98022e";
const GOLD = "#c9a24b";
const AUTO_SCROLL_MS = 3000;
const CENTER_SCALE = 1.175;
const SIDE_TILT = 6;

const BOTTLES = [
  {
    name: "Dom Perignon",
    src: encodeURI("/corporate/bottles/engravedbottle03.png"),
    tilt: -6,
    delay: 0.15,
    height: "h-[260px] md:h-[400px]",
    floatDuration: "6s",
    floatDelay: "0s",
  },
  {
    name: "Bottle Two",
    src: encodeURI("/corporate/bottles/domperignon.png"),
    tilt: 0,
    delay: 0.35,
    height: "h-[300px] md:h-[470px]",
    floatDuration: "5s",
    floatDelay: "0.8s",
  },
  {
    name: "Bottle Three",
    src: encodeURI("/corporate/bottles/engravedbottle.png"),
    tilt: 6,
    delay: 0.55,
    height: "h-[260px] md:h-[400px]",
    floatDuration: "6.5s",
    floatDelay: "1.6s",
  },
  {
    name: "Bottle Four",
    src: encodeURI("/corporate/bottles/silveroakmessage.png"),
    tilt: 6,
    delay: 0.55,
    height: "h-[260px] md:h-[400px]",
    floatDuration: "6.5s",
    floatDelay: "1.6s",
  },
  {
    name: "Bottle Five",
    src: encodeURI("/corporate/bottles/messagebottle.png"),
    tilt: 6,
    delay: 0.55,
    height: "h-[260px] md:h-[400px]",
    floatDuration: "6.5s",
    floatDelay: "1.6s",
  },
];

const CUSTOM_OPTIONS = [
  {
    title: "Custom Logo",
    description: "Your company logo, engraved with crisp detail on the bottle.",
    image: "/corporate/bottles/examplelogo.png",
    alt: "Custom logo laser engraved on a bottle",
    delay: 0.8,
  },
  {
    title: "Custom Message",
    description:
      "A personal note, name or date engraved to make the gift unforgettable.",
    image: "/corporate/bottles/examplemessage.png",
    alt: "Custom message laser engraved on a bottle",
    delay: 1,
  },
  {
    title: "Logo & Message on Box",
    description:
      "Your logo and a personal message printed on the gift box for a premium first impression.",
    image: "/corporate/bottles/examplebox.png",
    alt: "Custom logo and message on a gift box",
    delay: 1.2,
  },
  {
    title: "Message on Gift Card",
    description: "A custom message on a gift card, delivered with the gift.",
    image: "/corporate/bottles/examplecard.png",
    alt: "Custom message on a gift card",
    delay: 1.4,
  },
];

const EngravedBottles = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const updateVisibleCount = () => {
      setVisibleCount(mediaQuery.matches ? 3 : 1);
      setCurrentIndex(0);
    };

    updateVisibleCount();
    mediaQuery.addEventListener("change", updateVisibleCount);
    return () => mediaQuery.removeEventListener("change", updateVisibleCount);
  }, []);

  const maxIndex = Math.max(BOTTLES.length - visibleCount, 0);

  useEffect(() => {
    if (!isVisible || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTO_SCROLL_MS);

    return () => clearInterval(timer);
  }, [isVisible, isPaused, maxIndex]);

  const centerIndex =
    Math.min(currentIndex, maxIndex) + Math.floor(visibleCount / 2);

  const centerScale = visibleCount === 3 ? CENTER_SCALE : 1;

  return (
    <section
      ref={sectionRef}
      className="bg-white py-12 md:py-20 px-3 2xl:px-32 font-hind-madurai overflow-hidden"
    >
      <style>{`
        @keyframes tb-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .tb-float { animation: tb-float 6s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .tb-float, .tb-glow, .tb-shine { animation: none; }
        }
      `}</style>

      <div className="max-w-[1100px] mx-auto text-center mb-14 md:mb-20">
        <h2 className="text-2xl md:text-[32px] font-bold mb-3 font-sarabun">
          Our Personalized Collection
        </h2>
        <p className="text-[#555] text-sm md:text-base leading-relaxed max-w-lg mx-auto">
          Premium bottles, engraved with your logo or message.
        </p>
      </div>

      <div
        className="relative max-w-[1100px] py-3 mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="tb-glow absolute left-1/2 top-1/2 w-[80%] h-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${GOLD}55 0%, ${MAROON}18 55%, transparent 75%)`,
          }}
        />

        <div className="relative overflow-x-clip overflow-y-visible pt-12 md:pt-32 pb-12">
          <div
            className="flex items-end transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(-${
                Math.min(currentIndex, maxIndex) * (100 / visibleCount)
              }%)`,
            }}
          >
            {BOTTLES.map((bottle, index) => {
              const isCenter = index === centerIndex;
              const tilt = isCenter
                ? 0
                : index < centerIndex
                  ? -SIDE_TILT
                  : SIDE_TILT;
              const scale = isCenter ? centerScale : 1;

              return (
                <div
                  key={bottle.src}
                  className="flex-none flex justify-center items-end"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div
                    className="origin-bottom transition-transform duration-1000 ease-in-out"
                    style={{ transform: `rotate(${tilt}deg) scale(${scale})` }}
                  >
                    <div
                      className={`group transition-all duration-1000 ease-out ${
                        isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-16"
                      }`}
                      style={{ transitionDelay: `${bottle.delay}s` }}
                    >
                      <div className="transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03]">
                        <div
                          className="tb-float"
                          style={{
                            animationDuration: bottle.floatDuration,
                            animationDelay: bottle.floatDelay,
                          }}
                        >
                          <div className="relative aspect-[3/4] h-[300px] md:h-[400px] px-2">
                            <Image
                              src={bottle.src}
                              alt={`${bottle.name} laser engraved bottle`}
                              fill
                              sizes="(max-width: 768px) 100vw, 300px"
                              className="object-contain drop-shadow-2xl"
                            />

                            <div
                              className="tb-shine absolute inset-0 pointer-events-none"
                              style={{
                                animationDelay: bottle.floatDelay,
                                background:
                                  "linear-gradient(110deg, transparent 38%, rgba(255,255,255,0.5) 50%, transparent 62%)",
                                backgroundSize: "250% 100%",
                                WebkitMaskImage: `url(${bottle.src})`,
                                maskImage: `url(${bottle.src})`,
                                WebkitMaskSize: "contain",
                                maskSize: "contain",
                                WebkitMaskRepeat: "no-repeat",
                                maskRepeat: "no-repeat",
                                WebkitMaskPosition: "center",
                                maskPosition: "center",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-12 md:mt-16">
        {CUSTOM_OPTIONS.map((option) => (
          <div
            key={option.title}
            className={`group transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-16"
            }`}
            style={{ transitionDelay: `${option.delay}s` }}
          >
            <div
              className="relative aspect-[16/9] overflow-hidden rounded-lg border transition-shadow duration-500 group-hover:shadow-lg"
              style={{ borderColor: `${GOLD}66` }}
            >
              <Image
                src={option.image}
                alt={option.alt}
                fill
                sizes="(max-width: 768px) 50vw, 220px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            <div className="text-center mt-2">
              <h3 className="text-xs md:text-sm font-bold font-sarabun mb-0.5">
                {option.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12 md:mt-16">
        <Link
          href="/personalized/"
          className="inline-flex items-center justify-center text-white px-8 py-3 font-semibold text-sm tracking-wide no-underline transition-colors"
          style={{ backgroundColor: MAROON }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#7a0225")
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = MAROON)}
        >
          Shop Personalized Gifts
        </Link>
      </div>
    </section>
  );
};

export default EngravedBottles;