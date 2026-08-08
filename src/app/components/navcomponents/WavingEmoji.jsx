// WavingEmoji.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";

const WavingEmoji = ({ isLoggedIn, size = 16 }) => {
  const [wave, setWave] = useState(false);
  const prevLoggedIn = useRef(isLoggedIn);

  useEffect(() => {
    // sirf false -> true transition pe wave fire hogi, page refresh pe nahi
    if (!prevLoggedIn.current && isLoggedIn) {
      setWave(true);
      const timer = setTimeout(() => setWave(false), 1400);
      return () => clearTimeout(timer);
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  return (
    <span
      className={wave ? "wave-animate" : ""}
      style={{ display: "inline-block", transformOrigin: "70% 70%" }}
    >
      <User size={size} strokeWidth={2} />
    </span>
  );
};

export default WavingEmoji;