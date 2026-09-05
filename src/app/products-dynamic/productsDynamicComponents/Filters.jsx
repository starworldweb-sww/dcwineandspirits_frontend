"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CircleX, Minus, Plus, Check } from "lucide-react";
import { Box, Slider, Input, Typography, Stack } from "@mui/material";
import { decodeHtml } from "@/libs/decodeHtml";

const NAVY = "#14213d";
const ACCENT = "#98022e";

const STATIC_AVAILABILITY = [
  { id: "in_stock", label: "In Stock" },
  { id: "out_of_stock", label: "Out of Stock" },
];

const AUTO_CLOSE_DELAY_MS = 500;

const PriceSlider = ({ min, max, value, onCommit }) => {
  const [dragValue, setDragValue] = useState(value ?? [min, max]);

  useEffect(() => {
    if (value && (value[0] !== dragValue[0] || value[1] !== dragValue[1])) {
      setDragValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = (next) => {
    let [lo, hi] = next;
    lo = Math.min(max, Math.max(min, Number(lo)));
    hi = Math.min(max, Math.max(min, Number(hi)));
    if (lo > hi) [lo, hi] = [hi, lo];
    setDragValue([lo, hi]);
    onCommit?.([lo, hi]);
  };

  return (
    <Box sx={{ width: "100%", minWidth: 0, px: 1, pb: 2 }}>
      <Slider
        value={dragValue}
        onChange={(_, v) => setDragValue(v)}
        onChangeCommitted={(_, v) => commit(v)}
        valueLabelDisplay="auto"
        min={min}
        max={max}
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
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", justifyContent: "space-between", minWidth: 0, width: "100%" }}
      >
        {[0, 1].map((idx) => (
          <React.Fragment key={idx}>
            {idx === 1 && (
              <Typography
                variant="caption"
                sx={{ color: "#999", fontFamily: "Sarabun, sans-serif", flexShrink: 0 }}
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
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#666", mr: 0.5, fontFamily: "Sarabun, sans-serif", flexShrink: 0 }}
              >
                $
              </Typography>
              <Input
                value={dragValue[idx]}
                onChange={(e) => {
                  const next = [...dragValue];
                  next[idx] = e.target.value;
                  setDragValue(next);
                }}
                onBlur={() => commit(dragValue)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.target.blur();
                }}
                disableUnderline
                inputProps={{ step: 10, min, max, type: "number" }}
                sx={{
                  width: "100%",
                  minWidth: 0,
                  fontSize: "0.85rem",
                  fontFamily: "Sarabun, sans-serif",
                  "& input": {
                    textAlign: "center",
                    padding: 0,
                    minWidth: 0,
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

// FIX: label ko "min-w-0 truncate" diya aur badge ko "shrink-0" —
// isse lambe labels (jaise "BRANDS") badge ko bahar push nahi karte,
// aur agar space kam ho to label khud truncate ho jayega, badge nahi tootega
const SectionHeader = ({ label, isOpen, isApplied, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="w-full flex justify-between items-center gap-2 px-4 py-3 border-b border-gray-200 cursor-pointer"
  >
    <span className="flex items-center gap-2 min-w-0 flex-1">
      <p className="font-['Sarabun',sans-serif] font-bold text-sm tracking-widest text-black uppercase truncate">
        {label}
      </p>
      {isApplied && (
        <span className="flex items-center gap-1 shrink-0 font-['Sarabun',sans-serif] text-[10px] font-semibold tracking-wide text-[#98022e] bg-[#98022e]/10 rounded-full px-2 py-[3px] leading-none animate-[fadeIn_0.2s_ease-out]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#98022e]" />
          Applied
        </span>
      )}
    </span>
    <span className="w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 bg-white border-1 border-[#9c1750]">
      {isOpen ? (
        <Minus size={12} className="text-[#98022e]" />
      ) : (
        <Plus size={12} className="text-[#98022e]" />
      )}
    </span>
  </button>
);

const Filters = ({
  data,
  priceRange,
  onPriceChange,
  selectedAvailability,
  onAvailabilityChange,
  selectedBrandIds,
  onBrandChange,
  onClear,
  onClose,
}) => {
  const [priceOpen, setPriceOpen] = useState(true);
  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [brandsOpen, setBrandsOpen] = useState(true);

  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const scheduleAutoClose = () => {
    if (!onClose) return;
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      onClose();
    }, AUTO_CLOSE_DELAY_MS);
  };

  const hasPriceRange =
    data?.priceRange?.min !== undefined &&
    data?.priceRange?.min !== null &&
    data?.priceRange?.max !== undefined &&
    data?.priceRange?.max !== null;

  const hasBrands = Array.isArray(data?.brands) && data.brands.length > 0;

  const isPriceApplied =
    hasPriceRange &&
    Array.isArray(priceRange) &&
    (priceRange[0] !== data.priceRange.min || priceRange[1] !== data.priceRange.max);

  const isAvailabilityApplied = selectedAvailability?.length > 0;
  const isBrandsApplied = selectedBrandIds?.length > 0;

  const activeFilterCount =
    (isPriceApplied ? 1 : 0) + (isAvailabilityApplied ? 1 : 0) + (isBrandsApplied ? 1 : 0);

  const handlePriceCommit = (next) => {
    onPriceChange?.(next);
    scheduleAutoClose();
  };

  const toggleAvailability = (id) => {
    const next = selectedAvailability.includes(id)
      ? selectedAvailability.filter((v) => v !== id)
      : [...selectedAvailability, id];
    onAvailabilityChange(next);
    scheduleAutoClose();
  };

  const toggleBrand = (id) => {
    const next = selectedBrandIds.includes(id)
      ? selectedBrandIds.filter((v) => v !== id)
      : [...selectedBrandIds, id];
    onBrandChange(next);
    scheduleAutoClose();
  };

  return (
    <div className="w-full max-w-[280px] font-['Sarabun',sans-serif]">
      {/* Header — FIX: flex-wrap add kiya taaki agar Clear button ke liye
          jagah kam pade (title + badge zyada wide ho jaye), to woh
          overflow hone ki bajaye neeche wrap ho jaye, na ki squeeze ho */}
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2 px-1 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="font-['Sarabun',sans-serif] text-xl font-bold text-black leading-none shrink-0">
              Filter
            </h2>
            {/* FIX: text pill ("1 applied") ki jagah ab ek chhota compact
                circular number badge — kam jagah leta hai, header row
                squeeze nahi hoti */}
            {activeFilterCount > 0 && (
              <span
                className="flex items-center justify-center shrink-0 w-5 h-5 rounded-full text-[11px] font-bold text-white bg-[#98022e] leading-none animate-[fadeIn_0.2s_ease-out]"
                title={`${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} applied`}
              >
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="h-[2px] w-10 mt-1 rounded-full bg-[#98022e]" />
        </div>
        <button
          type="button"
          onClick={() => {
            onClear?.();
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
          }}
          className="shrink-0 flex items-center justify-center gap-1.5 bg-black text-white text-sm font-['Sarabun',sans-serif] px-4 py-1.5 hover:bg-gray-800 transition-colors cursor-pointer hover:scale-102 active:scale-98 hover:rounded-xl"
        >
          <CircleX size={14} />
          <span>Clear</span>
        </button>
      </div>

      {/* PRICE */}
      {hasPriceRange && (
        <>
          <SectionHeader
            label="Price"
            isOpen={priceOpen}
            isApplied={isPriceApplied}
            onToggle={() => setPriceOpen((p) => !p)}
          />
          {priceOpen && (
            <div className="px-1 pt-4 pb-2">
              <PriceSlider
                min={data.priceRange.min}
                max={data.priceRange.max}
                value={priceRange}
                onCommit={handlePriceCommit}
              />
            </div>
          )}
        </>
      )}

      {/* AVAILABILITY */}
      <SectionHeader
        label="Availability"
        isOpen={availabilityOpen}
        isApplied={isAvailabilityApplied}
        onToggle={() => setAvailabilityOpen((p) => !p)}
      />
      {availabilityOpen && (
        <div className="flex flex-col px-4 py-2">
          {STATIC_AVAILABILITY.map((option) => (
            <label key={option.id} className="flex items-center gap-3 py-2 cursor-pointer">
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
      {hasBrands && (
        <>
          <SectionHeader
            label="Brands"
            isOpen={brandsOpen}
            isApplied={isBrandsApplied}
            onToggle={() => setBrandsOpen((p) => !p)}
          />
          {brandsOpen && (
            <div className="flex flex-col px-4 py-2 h-64 overflow-y-auto overflow-x-hidden">
              {data.brands.map((brand) => (
                <label
                  key={brand?.manufacturer_id}
                  className="flex items-center gap-3 py-2.5 cursor-pointer min-w-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrandIds.includes(brand?.manufacturer_id)}
                    onChange={() => toggleBrand(brand?.manufacturer_id)}
                    className="w-4 h-4 flex-shrink-0"
                    style={{ accentColor: ACCENT }}
                  />
                  <div className="w-[36px] h-[28px] flex items-center justify-center flex-shrink-0 relative border border-[#e33d889e]">
                    <Image
                      fill
                      loading="lazy"
                      src={`${process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL}${brand?.image}`}
                      alt={brand?.name}
                      className="object-contain"
                    />
                  </div>
                  <span className="font-sarabun text-sm text-[#374254] min-w-0 flex-1 truncate text-[12px]">
                    {decodeHtml(brand?.name)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Filters;