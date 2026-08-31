// ============================================================
// STEP 1: localStorage ke saath safe read/write karne ke liye
// utility functions. "typeof window === undefined" check zaroori
// hai kyunki Next.js server pe pehle render karta hai, aur
// server pe "window" object exist nahi karta.
// ============================================================

const STORAGE_KEY = "compareProductIds"; // localStorage mein isi naam se save hoga

// Step 1.1: Saari compare list (array of product slugs) nikalo
export function getCompareIds() {
  if (typeof window === "undefined") return []; // server pe khaali array bhejo

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Compare list padhne mein error:", error);
    return [];
  }
}

// Step 1.2: Ek naya product slug list mein add karo (duplicate na ho)
export function addToCompare(productSlug) {
  if (typeof window === "undefined") return;

  const currentIds = getCompareIds();

  // Agar already list mein hai, dobara add mat karo
  if (currentIds.includes(productSlug)) return;

  const updatedIds = [...currentIds, productSlug];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIds));

  // Step 1.3: Ek custom event fire karo taaki dusre components
  // (jaise Navbar ka compare count) turant update ho jaayein
  window.dispatchEvent(new Event("compareListUpdated"));
}

// Step 1.4: Ek product slug list se remove karo
export function removeFromCompare(productSlug) {
  if (typeof window === "undefined") return;

  const currentIds = getCompareIds();
  const updatedIds = currentIds.filter((slug) => slug !== productSlug);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIds));
  window.dispatchEvent(new Event("compareListUpdated"));
}

// Step 1.5: Poori list clear karni ho to
export function clearCompareList() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("compareListUpdated"));
}