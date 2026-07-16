

import React from "react";

const HeroBanner = () => {
  return (
    <div className="w-full lg:px-3 2xl:px-32 lg:py-4">
      <img
        src="fifa-worldcup-2026-2560x780.webp"
       title="fifa world cup 2026, tattinger"
        alt="fifa-world-cup-2026"
        width={1280}
        height={390}
        loading="eager"
        fetchPriority="high"
        className="block w-full h-auto max-w-full aspect-[1280/390] object-cover transition-[0.2s] cursor-pointer"
      />
    </div>
  );
};

export default HeroBanner;