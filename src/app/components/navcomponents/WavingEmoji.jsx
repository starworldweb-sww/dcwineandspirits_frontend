"use client";

import React from "react";

const WavingEmoji = ({ emoji = "👋", size = 24 }) => {
  return (
    <>
      <span
        className="inline-block wave-emoji"
        style={{ fontSize: `${size}px`, transformOrigin: "70% 70%" }}
      >
        {emoji}
      </span>

      <style jsx>{`
        .wave-emoji {
          animation: wave 2.5s infinite;
        }

        @keyframes wave {
          0% {
            transform: rotate(0deg);
          }
          10% {
            transform: rotate(14deg);
          }
          20% {
            transform: rotate(-8deg);
          }
          30% {
            transform: rotate(14deg);
          }
          40% {
            transform: rotate(-4deg);
          }
          50% {
            transform: rotate(10deg);
          }
          60% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </>
  );
};

export default WavingEmoji;