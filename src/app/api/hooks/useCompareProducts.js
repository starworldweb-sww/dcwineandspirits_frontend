"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getCompareIds,
  addToCompare,
  removeFromCompare,
  clearCompareList,
} from "@/libs/compareStorage";

// ============================================================
// STEP 2: Yeh hook koi bhi component use kar sakta hai — ye
// automatically localStorage se sync rahega, aur agar kahin
// aur se (jaise dusre tab ya dusre component se) list change
// ho, to yeh bhi turant update ho jaayega.
// ============================================================
export function useCompareList() {
  const [compareIds, setCompareIds] = useState([]);

  // Step 2.1: Component mount hote hi localStorage se initial data uthao
  useEffect(() => {
    setCompareIds(getCompareIds());

    // Step 2.2: Jab bhi "compareListUpdated" event fire ho
    // (chahe isi tab mein, chahe dusre component se), state refresh karo
    function handleUpdate() {
      setCompareIds(getCompareIds());
    }

    window.addEventListener("compareListUpdated", handleUpdate);

    // Step 2.3: Agar user ne DUSRE browser tab mein change kiya ho,
    // to "storage" event fire hota hai — usse bhi sync kar lo
    window.addEventListener("storage", handleUpdate);

    // Cleanup: component unmount hone pe listeners hata do
    return () => {
      window.removeEventListener("compareListUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Step 2.4: Component ke liye easy-to-use functions expose karo
  const addProduct = useCallback((id) => {
    addToCompare(id);
  }, []);

  const removeProduct = useCallback((id) => {
    removeFromCompare(id);
  }, []);

  const clearAll = useCallback(() => {
    clearCompareList();
  }, []);

  return {
    compareIds, // e.g. [1, 2, 3]
    addProduct,
    removeProduct,
    clearAll,
    count: compareIds.length,
  };
}