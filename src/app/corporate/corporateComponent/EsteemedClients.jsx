import Image from "next/image";

const MAROON = "#98022e";

// Step 1: Logo list - files live in public/logos, so the path starts with /logos
// "scale" is optional (default 1). Use it to enlarge logos that have a lot of
// empty space inside their image, so every logo looks about the same size.
const CLIENT_LOGOS = [
  { name: "9PG", src: "/logos/9pgdc.png" },
  { name: "Amazon", src: "/logos/amazon.png" },
  { name: "Apple", src: "/logos/apple-logo.png" },
  { name: "Capital One", src: "/logos/capital-one.png" },
  { name: "Deloitte", src: "/logos/delloitedc.png" },
  { name: "Google", src: "/logos/googledc.png" },
  { name: "Microsoft", src: "/logos/microsoftdc.png" },
  { name: "Verizon", src: "/logos/verizondc.png" },
  { name: "VUIM", src: "/logos/vuimdc.png", scale: 1.3 },
];

// Step 2: Narrower slots = smaller gap between logos
const ITEM_WIDTH_CLASSES = "w-[130px] md:w-[170px]";

// Step 3: Scroll duration in seconds (bigger number = slower)
const SCROLL_DURATION = "45s";

const EsteemedClients = () => {
  // Step 4: Duplicate the list so the loop is seamless
  const loopedLogos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className="bg-white py-10 md:py-14 px-3 2xl:px-32 font-hind-madurai mb-5">
      {/* Step 5: Keyframes for the scrolling animation */}
      <style>{`
        @keyframes clients-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .clients-marquee-track {
          animation: clients-marquee ${SCROLL_DURATION} linear infinite;
        }
        /* Pause when the user hovers over the slider */
        .clients-marquee:hover .clients-marquee-track {
          animation-play-state: paused;
        }
        /* Respect users who prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .clients-marquee-track { animation: none; }
        }
      `}</style>

      {/* Step 6: Heading in the DC theme (centered, maroon underline) */}
      <div className="flex flex-col items-center text-center mb-8">
        <h2 className="text-2xl md:text-[32px] font-bold font-sarabun">
          Our Esteemed Clients
        </h2>
        <div className="mt-3 h-[2px] w-16" style={{ backgroundColor: MAROON }} />
        <p className="mt-4 text-sm md:text-base text-gray-500">
          Trusted by leading companies for their corporate gifting
        </p>
      </div>

      {/* Step 7: Slider wrapper - the mask fades the left and right edges */}
      <div
        className="clients-marquee overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        {/* Step 8: The moving track */}
        <div className="clients-marquee-track flex w-max items-center">
          {loopedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className={`${ITEM_WIDTH_CLASSES} flex-none px-2 md:px-3`}
              // Hide the duplicated half from screen readers
              aria-hidden={index >= CLIENT_LOGOS.length}
            >
              {/* Step 9: Taller box = bigger logos */}
              <div className="relative w-full h-[72px] md:h-[100px]">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  sizes="(max-width: 768px) 130px, 170px"
                  className="object-contain"
                  // Step 10: Per-logo size tweak (defaults to 1 = no change)
                  style={{ transform: `scale(${logo.scale ?? 1})` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EsteemedClients;