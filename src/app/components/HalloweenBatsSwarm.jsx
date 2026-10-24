"use client";
import React, { useEffect, useState } from "react";

// Flip this to false once Halloween is over
const BATS_ON = true;

// STEP 1 (NEW): key used to remember that the bats have already flown once.
// Change the text if you ever want to show the bats again to everyone.
const SEEN_KEY = "halloween-bats-seen";

// Still just a few bats passing by, not a swarm
const DESKTOP_BAT_COUNT = 6;
const MOBILE_BAT_COUNT = 3;

// Chance (0 to 1) that a bat is drawn from the side instead of from the front
const SIDE_VIEW_CHANCE = 0.55;

const BODY_COLOR = "#0A0A0F";
const BONE_COLOR = "#4A3A6A";

// ---------------------------------------------------------------------------
// Front view bat
// ---------------------------------------------------------------------------

// Left wing only, the right one is a mirrored copy.
// Sharp tip on the outside and four pointed spikes along the bottom edge.
const FRONT_WING_PATH =
  "M46 21 C42 14, 34 8, 26 6 C18 3, 8 4, 1 9 Q7 14, 9 28 Q14 20, 21 33 Q26 24, 33 34 Q39 27, 46 32 Z";

// Arm bone from the shoulder to the wrist, then one finger bone out to each spike
const FRONT_WING_BONES = [
  "M46 22 L26 6",
  "M26 6 L1 9",
  "M26 6 L9 28",
  "M26 6 L21 33",
  "M26 6 L33 34",
  // Small claw at the wrist
  "M26 6 L23.5 1.5",
];

// ---------------------------------------------------------------------------
// Side view bat (drawn facing right, flipped when it flies left)
// ---------------------------------------------------------------------------

// The wing is drawn raised, attached at the shoulder (52, 26).
// Jagged tip on the left and three spikes along the bottom edge.
const SIDE_WING_PATH =
  "M52 26 L40 5 C34 4 26 8 20 16 Q24 18 23 26 Q28 22 31 31 Q35 26 38 34 Q44 30 48 33 Z";

const SIDE_WING_BONES = [
  "M52 26 L40 5",
  "M40 5 L20 16",
  "M40 5 L23 26",
  "M40 5 L31 31",
  "M40 5 L38 34",
  // Small claw at the wrist
  "M40 5 L38 1",
];

// Head in profile with a short snout pointing right
const SIDE_HEAD_PATH =
  "M58 26 Q60 22 66 23 Q71 24 75 30 Q71 34 66 34 Q60 34 58 31 Z";

// Random number between min and max
const rand = (min, max) => Math.random() * (max - min) + min;

// Every bat gets its own random settings so they never look copy-pasted.
// "Far" bats are small, faded and slightly blurred, "near" bats are bigger and sharper.
// Mixing the two gives the group some depth.
const makeBats = (count) =>
  Array.from({ length: count }, (_, i) => {
    const isFar = Math.random() < 0.35;
    const isSide = Math.random() < SIDE_VIEW_CHANCE;
    const goesRight = Math.random() > 0.5; // true = left to right, false = right to left

    return {
      id: i,
      isFar,
      isSide,
      goesRight,
      // The side view is drawn facing right, so it only needs flipping when flying left
      flip: isSide && !goesRight,
      top: rand(6, 85), // % from the top of the screen
      size: isFar ? rand(14, 26) : rand(28, 50), // width in px
      duration: isFar ? rand(5, 8) : rand(4, 6.5), // seconds to cross the screen
      delay: rand(0, 2), // seconds before this bat appears
      flapSpeed: isFar ? rand(0.16, 0.24) : rand(0.22, 0.34), // seconds per wing flap
      amplitude: isFar ? rand(6, 14) : rand(14, 38), // up and down bobbing, in px
      bobDuration: rand(2, 3.4), // seconds per bob
      eyeFlicker: rand(1.6, 3.4), // seconds per eye flicker
      opacity: isFar ? rand(0.35, 0.5) : rand(0.8, 0.95),
    };
  });

// Gradients shared by both views. Ids must be unique per bat, otherwise bats would
// all use the first bat's definition.
const BatDefs = ({ ids }) => (
  <defs>
    {/* Wing skin: dark purple near the body, almost black at the tips */}
    <linearGradient id={ids.wing} x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stopColor="#2A1B3D" />
      <stop offset="1" stopColor="#07050B" />
    </linearGradient>

    {/* Soft red glow behind each eye */}
    <radialGradient id={ids.eye}>
      <stop offset="0" stopColor="#FF3B30" stopOpacity="0.9" />
      <stop offset="1" stopColor="#FF3B30" stopOpacity="0" />
    </radialGradient>
  </defs>
);

// --- Front view -----------------------------------------------------------

const FrontWing = ({ gradientId }) => (
  <g className="swarm-wing">
    <path d={FRONT_WING_PATH} fill={`url(#${gradientId})`} />
    {FRONT_WING_BONES.map((d) => (
      <path
        key={d}
        d={d}
        stroke={BONE_COLOR}
        strokeWidth="0.7"
        strokeLinecap="round"
        fill="none"
      />
    ))}
  </g>
);

const FrontBatArt = ({ ids }) => (
  <>
    <BatDefs ids={ids} />

    <FrontWing gradientId={ids.wing} />

    {/* Mirrored wing for the right side */}
    <g transform="translate(100 0) scale(-1 1)">
      <FrontWing gradientId={ids.wing} />
    </g>

    {/* Tall pointed ears */}
    <polygon points="45,18 45.5,5 50,14" fill={BODY_COLOR} />
    <polygon points="55,18 54.5,5 50,14" fill={BODY_COLOR} />

    {/* Body and head */}
    <ellipse cx="50" cy="30" rx="4.6" ry="9.5" fill={BODY_COLOR} />
    <ellipse cx="50" cy="20" rx="5.4" ry="5.6" fill={BODY_COLOR} />

    {/* Tiny feet */}
    <path
      d="M47.8 38 L46.6 42 M52.2 38 L53.4 42"
      stroke={BODY_COLOR}
      strokeWidth="1.2"
      strokeLinecap="round"
    />

    {/* Glowing red eyes, they flicker */}
    <g className="swarm-eyes">
      <circle cx="47.6" cy="19.6" r="3.4" fill={`url(#${ids.eye})`} />
      <circle cx="52.4" cy="19.6" r="3.4" fill={`url(#${ids.eye})`} />
      <circle cx="47.6" cy="19.6" r="1.2" fill="#FF2A2A" />
      <circle cx="52.4" cy="19.6" r="1.2" fill="#FF2A2A" />
    </g>

    {/* Little fangs */}
    <polygon points="48.6,24 49.6,24 49.1,27.2" fill="#FFFFFF" />
    <polygon points="50.4,24 51.4,24 50.9,27.2" fill="#FFFFFF" />
  </>
);

// --- Side view ------------------------------------------------------------

const SideBatArt = ({ ids }) => (
  <>
    <BatDefs ids={ids} />

    {/* Everything is inside one group so the whole bat can bounce a little with each flap */}
    <g className="swarm-side-body">
      {/* Far wing: behind the body, darker and a bit lower, flapping slightly out of step */}
      <g transform="translate(5 2)">
        <g className="swarm-side-wing swarm-side-wing-far" opacity="0.75">
          <path d={SIDE_WING_PATH} fill="#0B0812" />
          {SIDE_WING_BONES.map((d) => (
            <path
              key={d}
              d={d}
              stroke="#2E2347"
              strokeWidth="0.6"
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </g>
      </g>

      {/* Small membrane between the legs and tail */}
      <path d="M38 33 Q29 35 25 42 L41 38 Z" fill={BODY_COLOR} />

      {/* Body */}
      <ellipse cx="48" cy="32" rx="13" ry="7" fill={BODY_COLOR} />

      {/* Pointed ear */}
      <polygon points="61,24 62,11 67,23" fill={BODY_COLOR} />

      {/* Head with the snout */}
      <path d={SIDE_HEAD_PATH} fill={BODY_COLOR} />

      {/* Feet hanging down */}
      <path
        d="M45 38 L43 43 M51 38 L51 43"
        stroke={BODY_COLOR}
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* Glowing red eye, it flickers */}
      <g className="swarm-eyes">
        <circle cx="68.5" cy="28" r="3.6" fill={`url(#${ids.eye})`} />
        <circle cx="68.5" cy="28" r="1.3" fill="#FF2A2A" />
      </g>

      {/* Little fang under the jaw */}
      <polygon points="70.6,33 72.2,33 71.4,36.6" fill="#FFFFFF" />

      {/* Near wing: drawn last so it sits in front of the body */}
      <g className="swarm-side-wing">
        <path d={SIDE_WING_PATH} fill={`url(#${ids.wing})`} />
        {SIDE_WING_BONES.map((d) => (
          <path
            key={d}
            d={d}
            stroke={BONE_COLOR}
            strokeWidth="0.7"
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </g>
    </g>
  </>
);

const Bat = ({ bat }) => {
  const ids = {
    wing: `bat-wing-${bat.id}`,
    eye: `bat-eye-${bat.id}`,
  };

  return (
    // Outer span: carries the bat across the screen, once
    <span
      className="absolute left-0 block will-change-transform"
      style={{
        top: `${bat.top}%`,
        animation: `${
          bat.goesRight ? "swarm-cross-ltr" : "swarm-cross-rtl"
        } ${bat.duration}s linear ${bat.delay}s 1 both`,
      }}
    >
      {/* Inner span: the up and down wobble while it flies */}
      <span
        className="block"
        style={{
          "--amp": `${bat.amplitude}px`,
          animation: `swarm-bob ${bat.bobDuration}s ease-in-out ${bat.delay}s infinite`,
        }}
      >
        <svg
          // The side view has a tighter viewBox because the bat only fills the middle of it
          viewBox={bat.isSide ? "14 0 70 50" : "0 0 100 50"}
          style={{
            width: bat.size,
            height: "auto",
            // Wings swing outside the box while flapping, so don't clip them
            overflow: "visible",
            opacity: bat.opacity,
            "--flap": `${bat.flapSpeed}s`,
            "--eye": `${bat.eyeFlicker}s`,
            // Near bats get a faint red glow, far bats get a soft blur
            filter: bat.isFar
              ? "blur(0.6px)"
              : "drop-shadow(0 0 4px rgba(200,20,20,0.45))",
            // Side bats should always face the way they are flying
            transform: bat.flip ? "scaleX(-1)" : undefined,
          }}
        >
          {bat.isSide ? <SideBatArt ids={ids} /> : <FrontBatArt ids={ids} />}
        </svg>
      </span>
    </span>
  );
};

const HalloweenBatsSwarm = () => {
  const [bats, setBats] = useState([]);

  useEffect(() => {
    if (!BATS_ON) return;

    // Skip the whole thing for people who asked their device for less motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // STEP 2 (NEW): if the bats already flew in this session, do nothing.
    // try/catch because storage can be blocked (e.g. some private modes).
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch (e) {
      // If storage is blocked we just continue and show the bats
    }

    // Every timer goes in here so the cleanup below can cancel them all
    const timers = [];

    // Small wait so the bats don't compete with the page's own loading
    timers.push(
      setTimeout(() => {
        const count =
          window.innerWidth < 768 ? MOBILE_BAT_COUNT : DESKTOP_BAT_COUNT;
        const newBats = makeBats(count);
        setBats(newBats);

        // STEP 3 (NEW): remember that the bats have flown, so they don't come again
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch (e) {
          // Ignore, worst case the bats show again on the next load
        }

        // Remove everything once the slowest bat has left the screen
        const lastBatLeavesAt = Math.max(
          ...newBats.map((bat) => bat.delay + bat.duration),
        );
        timers.push(
          setTimeout(() => setBats([]), (lastBatLeavesAt + 0.5) * 1000),
        );
      }, 500),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // Nothing on the server, and nothing once the bats are gone
  if (bats.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      // pointer-events-none so the bats never block clicks or scrolling
      className="fixed inset-0 z-[50] pointer-events-none overflow-hidden"
    >
      {bats.map((bat) => (
        <Bat key={bat.id} bat={bat} />
      ))}

      <style jsx global>{`
        /* Straight run across the screen, starting and ending just outside it */
        @keyframes swarm-cross-ltr {
          from { transform: translateX(-15vw); }
          to   { transform: translateX(115vw); }
        }
        @keyframes swarm-cross-rtl {
          from { transform: translateX(115vw); }
          to   { transform: translateX(-15vw); }
        }

        /* Up and down wobble. --amp is set per bat, so every bat bobs differently */
        @keyframes swarm-bob {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          25%      { transform: translateY(calc(var(--amp) * -1)) rotate(3deg); }
          75%      { transform: translateY(var(--amp)) rotate(-4deg); }
        }

        /* Front view: wings flap by rotating around the shoulder point.
           The downstroke is a bit slower than the upstroke, which looks more like a real flap. */
        @keyframes swarm-wing-flap {
          0%, 100% { transform: rotate(26deg); }
          40%      { transform: rotate(-28deg); }
        }
        .swarm-wing {
          transform-origin: 46px 22px;
          animation: swarm-wing-flap var(--flap, 0.3s) ease-in-out infinite;
        }

        /* Side view: the wing starts raised and swings down and back around the shoulder */
        @keyframes swarm-side-wing-flap {
          0%, 100% { transform: rotate(10deg); }
          40%      { transform: rotate(-62deg); }
        }
        .swarm-side-wing {
          transform-origin: 52px 26px;
          animation: swarm-side-wing-flap var(--flap, 0.3s) ease-in-out infinite;
        }
        /* Far wing runs slightly behind the near one */
        .swarm-side-wing-far {
          animation-delay: calc(var(--flap, 0.3s) * -0.18);
        }

        /* The body dips a little when the wings go up and rises on the downstroke */
        @keyframes swarm-side-bounce {
          0%, 100% { transform: translateY(1.5px); }
          40%      { transform: translateY(-2px); }
        }
        .swarm-side-body {
          animation: swarm-side-bounce var(--flap, 0.3s) ease-in-out infinite;
        }

        /* Eyes flicker, like they are glaring at you */
        @keyframes swarm-eye-flicker {
          0%, 100% { opacity: 1; }
          45%      { opacity: 0.5; }
          50%      { opacity: 1; }
          72%      { opacity: 0.7; }
        }
        .swarm-eyes {
          animation: swarm-eye-flicker var(--eye, 2.4s) ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HalloweenBatsSwarm;