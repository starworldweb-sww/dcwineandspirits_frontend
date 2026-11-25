"use client";

import { useEffect, useState } from "react";

// Step 1: Colours used to draw Santa
const SANTA_RED = "#c8102e";
const SANTA_SKIN = "#f9d5b5";
const SANTA_WHITE = "#ffffff";
const SANTA_DARK = "#2b2b2b";

// Step 1b: Colours for the gift basket
const BASKET_BLACK = "#0f0f14";
const BASKET_RIM = "#23232c";
const GOLD = "#d4a82a";
const GOLD_DARK = "#a67c12";
const PAPER_FILLER = "#f1e3b8"; // the shredded paper at the top of the basket

// Step 1c: Colours for the bottle
const BOTTLE_GREEN = "#1b2b16";
const BOTTLE_DARK = "#0f190c";
const BOTTLE_SHINE = "#546e4b";
const BOTTLE_CAP = "#141414";

// Step 1d: Colours for the chocolate boxes
const CHOC_WHITE = "#f4efe9";
const CHOC_CREAM = "#e8dfd6";
const CHOC_BLUE = "#3b3f9a";
const CHOC_ORANGE = "#e0a030";
const CHOC_BROWN = "#6b3f22";
const CHOC_DARK = "#4a2a22";

// Step 1e: Colours for the black and gold bow
const BOW_DARK = "#2b1a0e";
const BOW_MID = "#4a3018";

// Step 2: Timing (all in seconds)
const START_DELAY = 1; // wait before Santa appears
const SLIDE_TIME = 0.9; // time to slide in, and also to slide out
const STAY_TIME = 3.5; // how long Santa stays on screen
const TOTAL_TIME = SLIDE_TIME + STAY_TIME + SLIDE_TIME;

// Step 3: Convert the timing into keyframe percentages
const toPercent = (seconds) => ((seconds / TOTAL_TIME) * 100).toFixed(2);
const SLIDE_IN_END = toPercent(SLIDE_TIME);
const SLIDE_OUT_START = toPercent(SLIDE_TIME + STAY_TIME);

const SantaPeek = () => {
  // Step 4: Controls whether Santa is on the page (the X button also uses this)
  const [isSantaVisible, setIsSantaVisible] = useState(true);

  // Step 5: Remove Santa from the page once his animation has finished
  useEffect(() => {
    const timer = setTimeout(
      () => setIsSantaVisible(false),
      (START_DELAY + TOTAL_TIME) * 1000,
    );
    return () => clearTimeout(timer);
  }, []);

  if (!isSantaVisible) return null;

  return (
    // Step 6: "hidden lg:block" = not shown on mobile/tablet, only on desktop (1024px+)
    <div className="santa-peek-wrapper hidden lg:block fixed right-0 bottom-16 z-40 w-[240px] pointer-events-none">
      {/* Step 7: Animations (slide in/out + basket bobbing) */}
      <style>{`
        /* One animation does everything: in -> stay -> out */
        @keyframes santa-peek {
          0%                    { transform: translateX(100%); }
          ${SLIDE_IN_END}%      { transform: translateX(0); }
          ${SLIDE_OUT_START}%   { transform: translateX(0); }
          100%                  { transform: translateX(100%); }
        }
        .santa-peek-wrapper {
          animation: santa-peek ${TOTAL_TIME}s ease-in-out ${START_DELAY}s both;
        }

        /* The basket (with both arms) bobs gently up and down */
        @keyframes santa-box-bob {
          from { transform: translateY(0); }
          to   { transform: translateY(-4px); }
        }
        .santa-box-group {
          animation: santa-box-bob 1s ease-in-out infinite alternate;
        }

        /* Respect users who prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .santa-peek-wrapper,
          .santa-box-group { animation: none; }
        }
      `}</style>

      {/* Step 8: Small close button */}
      <button
        type="button"
        onClick={() => setIsSantaVisible(false)}
        aria-label="Hide Santa"
        className="pointer-events-auto absolute top-0 left-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm leading-none text-gray-600 shadow hover:bg-gray-100"
      >
        ×
      </button>

      {/* Step 9: Santa drawing. The right side is cut off by the edge of the
          SVG on purpose, so he looks like he is peeking from the screen edge */}
      <svg viewBox="0 0 225 240" className="w-full h-auto" aria-hidden="true">
        {/* Step 9a: Body (red coat) */}
        <path
          d="M118 240 Q118 150 160 146 L225 146 L225 240 Z"
          fill={SANTA_RED}
        />

        {/* Step 9b: Head group (moved into position with translate) */}
        <g transform="translate(55 -15)">
          {/* Head */}
          <circle cx="150" cy="105" r="42" fill={SANTA_SKIN} />

          {/* Beard */}
          <path
            d="M106 110 Q108 168 150 170 L170 170 L170 110 Q140 128 106 110 Z"
            fill={SANTA_WHITE}
          />

          {/* Moustache */}
          <ellipse cx="122" cy="119" rx="16" ry="9" fill={SANTA_WHITE} />
          <ellipse cx="141" cy="119" rx="16" ry="9" fill={SANTA_WHITE} />

          {/* Eyes (both always open) */}
          <circle cx="126" cy="100" r="3.5" fill={SANTA_DARK} />
          <circle cx="148" cy="100" r="3.5" fill={SANTA_DARK} />

          {/* Eyebrows */}
          <path
            d="M118 92 Q126 87 133 92"
            stroke={SANTA_WHITE}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M141 92 Q148 87 155 92"
            stroke={SANTA_WHITE}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Nose, cheek and smile */}
          <circle cx="114" cy="111" r="6" fill="#f0a58f" />
          <circle cx="130" cy="112" r="6" fill="#f5a3a3" opacity="0.5" />
          <path
            d="M124 131 Q132 139 141 131"
            stroke="#9b1c1c"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Hat (red part, white fur band, white pom-pom) */}
          <path
            d="M106 82 Q104 44 96 34 Q140 20 170 34 L170 82 Z"
            fill={SANTA_RED}
          />
          <rect x="98" y="72" width="80" height="16" rx="8" fill={SANTA_WHITE} />
          <circle cx="96" cy="34" r="9" fill={SANTA_WHITE} />
        </g>

        {/* Step 9c: Arms + basket + hands (this group bobs up and down) */}
        <g className="santa-box-group">
          {/* Arms: drawn BEHIND the basket, they reach out to each side of it */}
          <line
            x1="170"
            y1="195"
            x2="30"
            y2="200"
            stroke={SANTA_RED}
            strokeWidth="18"
            strokeLinecap="round"
          />
          <line
            x1="185"
            y1="205"
            x2="128"
            y2="205"
            stroke={SANTA_RED}
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Step 9d: Items inside the basket (drawn first, the basket front covers their bottoms) */}

          {/* Big blue chocolate box at the back (right side) */}
          <g transform="rotate(5 114 126)">
            <rect x="96" y="98" width="36" height="56" rx="2" fill={CHOC_BLUE} stroke={GOLD} strokeWidth="2" />
            {/* Little gold confetti dots on the blue box */}
            <circle cx="106" cy="110" r="2" fill={GOLD} />
            <circle cx="118" cy="106" r="1.5" fill={GOLD} />
            <circle cx="124" cy="118" r="2" fill={GOLD} />
            <circle cx="110" cy="124" r="1.5" fill={GOLD} />
          </g>

          {/* Realistic Champagne / Wine bottle in the middle (taller & wider) */}
          <g>
            {/* Main bottle silhouette with sloped shoulders */}
            <path
              d="M74 44 L86 44 L87 72 C87 86 95 92 95 106 L95 152 L65 152 L65 106 C65 92 73 86 73 72 Z"
              fill={BOTTLE_GREEN}
            />

            {/* Right-side shadow for 3D cylindrical depth */}
            <path
              d="M84 44 L86 44 L87 72 C87 86 95 92 95 106 L95 152 L88 152 L88 106 C88 92 84 86 84 72 Z"
              fill={BOTTLE_DARK}
              opacity="0.65"
            />

            {/* Foil capsule / neck wrap */}
            <path
              d="M73.5 42 L86.5 42 L87.5 68 L72.5 68 Z"
              fill={BOTTLE_CAP}
            />
            {/* Top cork lip & gold foil trim */}
            <rect x="72" y="40" width="16" height="4.5" rx="2" fill="#242424" />
            <rect x="72.5" y="66" width="15" height="2.5" fill={GOLD} />
            {/* Small gold neck collar band */}
            <path d="M72 78 Q80 81 88 78 L88.5 81 Q80 84 71.5 81 Z" fill={GOLD} />

            {/* Left glass specular shine (vertical highlight + shoulder curve) */}
            <path
              d="M70 148 L70 106 C70 95 76 89 76 76"
              fill="none"
              stroke={BOTTLE_SHINE}
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.85"
            />
            <line
              x1="73.5"
              y1="108"
              x2="73.5"
              y2="146"
              stroke="#ffffff"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.25"
            />

            {/* Main front wine label (cream/gold framed with crest) */}
            <rect
              x="68"
              y="108"
              width="24"
              height="31"
              rx="1.5"
              fill="#f7f1e1"
              stroke={GOLD}
              strokeWidth="1.5"
            />
            {/* Inner thin border on label */}
            <rect
              x="70"
              y="110"
              width="20"
              height="27"
              fill="none"
              stroke={GOLD_DARK}
              strokeWidth="0.6"
            />
            {/* Red/Gold wax crest on label */}
            <circle cx="80" cy="116" r="2.8" fill="#9b1c1c" />
            <circle cx="80" cy="116" r="1.2" fill={GOLD} />
            {/* Decorative label lines */}
            <line x1="73" y1="122" x2="87" y2="122" stroke="#2b2b2b" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="75" y1="126" x2="85" y2="126" stroke={GOLD_DARK} strokeWidth="1" strokeLinecap="round" />
            <line x1="74" y1="130" x2="86" y2="130" stroke="#7a7267" strokeWidth="0.8" strokeLinecap="round" />
          </g>

          {/* Orange chocolate box (right, leaning) */}
          <g transform="rotate(-8 115 130)">
            <rect x="104" y="110" width="22" height="42" rx="1.5" fill={CHOC_ORANGE} />
            <rect x="104" y="120" width="22" height="6" fill={GOLD_DARK} />
          </g>

          {/* Brown chocolate box (front right, leaning) */}
          <g transform="rotate(-14 124 138)">
            <rect x="112" y="122" width="26" height="30" rx="1.5" fill={CHOC_BROWN} />
            <rect x="116" y="128" width="18" height="8" rx="1" fill={GOLD} opacity="0.85" />
          </g>

          {/* White chocolate box (left, leaning back) */}
          <g transform="rotate(-14 42 128)">
            <rect x="30" y="104" width="24" height="46" rx="1.5" fill={CHOC_WHITE} stroke="#d9cfc4" strokeWidth="1" />
            {/* Dark chocolate swirl patch */}
            <ellipse cx="42" cy="122" rx="7" ry="6" fill={CHOC_DARK} />
          </g>

          {/* Cream chocolate box (left, in front of the white one) */}
          <g transform="rotate(-6 50 136)">
            <rect x="38" y="120" width="26" height="30" rx="1.5" fill={CHOC_CREAM} stroke="#d9cfc4" strokeWidth="1" />
            {/* Caramel patch */}
            <rect x="43" y="127" width="16" height="12" rx="1.5" fill="#c9864a" />
          </g>

          {/* Shredded paper filler peeking out at the top of the basket */}
          <polyline
            points="24,152 30,145 36,152 44,146 52,152 60,146 65,152 95,152 100,146 108,152 116,146 124,152 130,146 136,152"
            fill="none"
            stroke={PAPER_FILLER}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Step 9e: Basket tray (black, wider at the top than the bottom) */}
          <path d="M22 150 L138 150 L124 225 L36 225 Z" fill={BASKET_BLACK} />
          {/* Basket rim along the top edge */}
          <rect x="20" y="148" width="120" height="6" rx="2" fill={BASKET_RIM} />

          {/* Step 9f: Black and gold bow with hanging tails */}
          {/* Thin gold streamers */}
          <line x1="80" y1="182" x2="38" y2="224" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="80" y1="182" x2="122" y2="224" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
          <path d="M78 184 L52 234 L66 226 L76 238 L84 188 Z" fill={BOW_DARK} stroke={GOLD} strokeWidth="1" />
          <path d="M82 184 L108 234 L94 226 L84 238 L76 188 Z" fill={BOW_MID} stroke={GOLD} strokeWidth="1" />
          <path
            d="M80 178 C52 150 34 172 46 188 C56 198 72 190 80 178 Z"
            fill={BOW_DARK}
            stroke={GOLD}
            strokeWidth="1.5"
          />
          <path
            d="M80 178 C108 150 126 172 114 188 C104 198 88 190 80 178 Z"
            fill={BOW_DARK}
            stroke={GOLD}
            strokeWidth="1.5"
          />
          <path d="M80 178 C62 162 52 176 58 184 C64 190 74 186 80 178 Z" fill={BOW_MID} />
          <path d="M80 178 C98 162 108 176 102 184 C96 190 86 186 80 178 Z" fill={BOW_MID} />
          <circle cx="80" cy="180" r="7" fill={BOW_MID} stroke={GOLD} strokeWidth="1.5" />
          <circle cx="30" cy="200" r="12" fill={SANTA_WHITE} stroke="#e5e5e5" strokeWidth="1" />
          <circle cx="128" cy="205" r="12" fill={SANTA_WHITE} stroke="#e5e5e5" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
};
export default SantaPeek;