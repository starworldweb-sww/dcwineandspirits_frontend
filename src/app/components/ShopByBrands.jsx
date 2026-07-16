import React from 'react';

// Using standard placeholder colors/text to mimic the logos shown in the design.
// In a real application, you would replace the background colors/text with actual <img> tags.
const BRANDS = [
  { id: 1, name: "Veuve Clicquot", bgColor: "#EAB23C", textColor: "#111" },
  { id: 2, name: "Penfolds", bgColor: "#B91223", textColor: "#FFF" },
  { id: 3, name: "Opus One", bgColor: "#1B476F", textColor: "#FFF" },
  { id: 4, name: "Dom Pérignon", bgColor: "#0D0D0B", textColor: "#DAB866" },
  { id: 5, name: "KRUG", bgColor: "#590D22", textColor: "#C39F57" },
  { id: 6, name: "LOUIS ROEDERER", bgColor: "#E2D3B8", textColor: "#111" },
  { id: 7, name: "GODIVA", bgColor: "#F5C77A", textColor: "#613B1F" },
  { id: 8, name: "LA MARCA", bgColor: "#A6DDF3", textColor: "#365972" },
];

export default function ShopByBrand() {
  return (
    <section className="w-full px-3 2xl:px-32 bg-white">
      
      {/* Heading Section
        Applied Hind Madurai, 16px, Normal, rgb(152, 2, 46) #98022e as requested.
        Note: The screenshot shows the font might be larger on desktop, 
        so I added standard responsive text sizing while honoring the requested color.
      */}
      <div className="mb-8 flex justify-between items-center border-t pt-2 border-gray-200 pb-2">
        <h2 
          className="uppercase tracking-wide"
          style={{ 
            fontFamily: "'Hind Madurai', sans-serif",
            color: "rgb(152, 2, 46)",
            fontWeight: 400
          }}
        >
          <span className="text-2xl font-semibold md:text-2xl md:font-bold text-black">SHOP BY BRAND</span>
        </h2>
      </div>

      {/* Grid Layout Container
        Mobile: 2 columns, gap-2 (matches the tight layout in mobile screenshot)
        Desktop: 4 columns, gap-4 (matches the wider layout in desktop screenshot)
      */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {BRANDS.map((brand) => (
          <a
            key={brand.id}
            href={`#brand-${brand.id}`}
            className="group relative block w-full overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
            // The aspect ratio from the inspector shows approx 246x127 (roughly 2:1)
            style={{ aspectRatio: '310 / 160' }} 
          >
            {/* Placeholder for the actual brand image. 
              In production, replace this div with an <img /> tag.
              <img src={brand.imgSrc} alt={brand.name} className="w-full h-full object-cover" />
            */}
            <div 
              className="w-full h-full flex flex-col items-center justify-center p-4 text-center transition-opacity group-hover:opacity-90"
              style={{ backgroundColor: brand.bgColor, color: brand.textColor }}
            >
               <span className="font-serif text-lg md:text-xl font-bold tracking-wider leading-tight">
                 {brand.name}
               </span>
            </div>
          </a>
        ))}
      </div>
      
    </section>
  );
}