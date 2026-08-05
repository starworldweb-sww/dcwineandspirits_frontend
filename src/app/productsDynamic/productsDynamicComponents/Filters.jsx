"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CircleX, Minus, Plus } from "lucide-react";
import { Box, Slider, Input, Typography, Stack } from "@mui/material";

// STEP 1: Design tokens for DC Wine's filter look (from the reference
// screenshot) — a dark navy for the price slider, and a maroon/pink accent
// for the underline + section toggle squares.
const NAVY = "#14213d";
const ACCENT = "#98022e";

// STEP 2: Static sample data (no props/API needed — this is a standalone
// demo). Swap these arrays/images for real data whenever you wire this up.
const STATIC_PRICE = { min: 0, max: 300, value: [39, 199] };

const STATIC_AVAILABILITY = [
  { id: "in_stock", label: "In Stock" },
  { id: "out_of_stock", label: "Out of Stock" },
];

const STATIC_BRANDS = [
  { id: 1, name: "La Marca", image: "/brands/la-marca.png" },
  { id: 2, name: "Lamberti", image: "/brands/lamberti.png" },
  { id: 3, name: "Maschio", image: "/brands/maschio.png" },
  { id: 4, name: "Mionetto", image: "/brands/mionetto.png" },
];

const PriceSlider = () => {
  const [localValue, setLocalValue] = useState(STATIC_PRICE.value);

  return (
    <Box sx={{ width: "100%", px: 1, pb: 2 }}>
      <Slider
        value={localValue}
        onChange={(_, v) => setLocalValue(v)}
        valueLabelDisplay="auto"
        min={STATIC_PRICE.min}
        max={STATIC_PRICE.max}
        sx={{
          color: NAVY,
          mb: 2,
          height: 4,
          "& .MuiSlider-thumb": {
            width: 16,
            height: 16,
            backgroundColor: NAVY,
            border: "2px solid #fff",
            boxShadow: `0 0 0 1px ${NAVY}`,
          },
          "& .MuiSlider-rail": { color: "#e0e0e0" },
        }}
      />
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
        {[0, 1].map((idx) => (
          <React.Fragment key={idx}>
            {idx === 1 && (
              <Typography
                variant="caption"
                sx={{ color: "#999", fontFamily: "Sarabun, sans-serif" }}
              >
                —
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #e0e0e0",
                px: 1,
                py: 0.6,
                borderRadius: "4px",
                flex: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#666", mr: 0.5, fontFamily: "Sarabun, sans-serif" }}
              >
                $
              </Typography>
              <Input
                value={localValue[idx]}
                onChange={(e) => {
                  const next = [...localValue];
                  next[idx] = e.target.value;
                  setLocalValue(next);
                }}
                onBlur={(e) => {
                  let num = e.target.value === "" ? STATIC_PRICE.min : Number(e.target.value);
                  if (isNaN(num)) num = STATIC_PRICE.min;
                  num = Math.min(STATIC_PRICE.max, Math.max(STATIC_PRICE.min, num));
                  const next = [...localValue];
                  next[idx] = num;
                  setLocalValue(next);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.target.blur();
                }}
                disableUnderline
                inputProps={{ step: 10, min: STATIC_PRICE.min, max: STATIC_PRICE.max, type: "number" }}
                sx={{
                  width: "100%",
                  fontSize: "0.85rem",
                  fontFamily: "Sarabun, sans-serif",
                  "& input": {
                    textAlign: "center",
                    padding: 0,
                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": { display: "none" },
                    MozAppearance: "textfield",
                  },
                }}
              />
            </Box>
          </React.Fragment>
        ))}
      </Stack>
    </Box>
  );
};

const SectionHeader = ({ label, isOpen, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="w-full flex justify-between items-center px-4 py-3 border-b border-gray-200 cursor-pointer"
  >
    <p className="font-['Sarabun',sans-serif] font-bold text-sm tracking-widest text-black uppercase">
      {label}
    </p>
    <span
      className="w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 bg-white border-1 border-[#9c1750]"
      
    >
      {isOpen ? (
        <Minus size={12} className="text-[#98022e]" />
      ) : (
        <Plus size={12} className="text-[#98022e]" />
      )}
    </span>
  </button>
);

const Filters = ({data}) => {
  console.log("data",data)
  const [priceOpen, setPriceOpen] = useState(true);
  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [brandsOpen, setBrandsOpen] = useState(true);

  // Static local selection state (no external onChange callbacks — this
  // is a self-contained demo, not wired to real filtering logic yet).
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState([]);

  const toggleAvailability = (id) => {
    setSelectedAvailability((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const toggleBrand = (id) => {
    setSelectedBrandIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const handleClear = () => {
    setSelectedAvailability([]);
    setSelectedBrandIds([]);
  };

  return (
    <div className="w-full max-w-[280px]  font-['Sarabun',sans-serif]">
      {/* Header */}
      <div className="flex justify-between items-center px-1 py-4">
        <div>
          <h2 className="font-['Sarabun',sans-serif] text-xl font-bold text-black leading-none">
            Filter
          </h2>
          <div
            className="h-[2px] w-10 mt-1 rounded-full bg-[#98022e]"
            
          />
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center justify-center gap-1.5 bg-black text-white text-sm font-['Sarabun',sans-serif] px-4 py-1.5 hover:bg-gray-800 transition-colors cursor-pointer hover:scale-102 active:scale-98 hover:rounded-xl"
        >
          <CircleX size={14} />
          <span>Clear</span>
        </button>
      </div>

      {/* PRICE */}
      <SectionHeader label="Price" isOpen={priceOpen} onToggle={() => setPriceOpen((p) => !p)} />
      {priceOpen && (
        <div className="px-1 pt-4 pb-2">
          <PriceSlider />
        </div>
      )}

      {/* AVAILABILITY */}
      <SectionHeader
        label="Availability"
        isOpen={availabilityOpen}
        onToggle={() => setAvailabilityOpen((p) => !p)}
      />
      {availabilityOpen && (
        <div className="flex flex-col px-4 py-2">
          {STATIC_AVAILABILITY.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-3 py-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedAvailability.includes(option.id)}
                onChange={() => toggleAvailability(option.id)}
                className="w-4 h-4 flex-shrink-0"
                style={{ accentColor: ACCENT }}
              />
              <span className="font-['Sarabun',sans-serif] text-sm text-[#374254]">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* BRANDS */}
      <SectionHeader label="Brands" isOpen={brandsOpen} onToggle={() => setBrandsOpen((p) => !p)} />
      {brandsOpen && (
        <div className="flex flex-col px-4 py-2">
          {STATIC_BRANDS.map((brand) => (
            <label
              key={brand?.id}
              className="flex items-center gap-3 py-2.5 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedBrandIds.includes(brand?.id)}
                onChange={() => toggleBrand(brand?.id)}
                className="w-4 h-4 flex-shrink-0"
                style={{ accentColor: ACCENT }}
              />
              <div className="w-[36px] h-[28px] flex items-center justify-center flex-shrink-0 relative">
                {/* NOTE: placeholder image path — swap with the real
                    brand logo asset paths when wiring this up. */}
                <Image
                  fill
                  loading="lazy"
                  src={`${brand?.image}`}
                  alt={brand?.name}
                  className="object-contain"
                />
              </div>
              <span className="font-['Sarabun',sans-serif] text-sm text-[#374254]">
                {brand?.name}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filters;