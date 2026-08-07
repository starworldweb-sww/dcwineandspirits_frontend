"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export default function Modal({ open, onOpenChange, title, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Background overlay */}
        <Dialog.Overlay
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50
          data-[state=open]:animate-in data-[state=open]:fade-in
          data-[state=closed]:animate-out data-[state=closed]:fade-out"
        />

        {/* Modal box */}
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          bg-white w-[calc(100%-2rem)] max-w-2xl max-h-[80vh] overflow-y-auto
          rounded-md shadow-2xl p-6 md:p-8 z-50 font-hind-madurai
          data-[state=open]:animate-in data-[state=open]:zoom-in-95
          data-[state=closed]:animate-out data-[state=closed]:zoom-out-95
          focus:outline-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
            <Dialog.Title className="text-xl md:text-2xl font-bold text-[#303841]">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="text-gray-400 hover:text-black transition-colors cursor-pointer"
              >
                <X size={22} />
              </button>
            </Dialog.Close>
          </div>

          {/* Body — jo bhi content pass hoga wahi yahan render hoga */}
          <div className="text-[14px] leading-relaxed text-[#222222]">
            {children}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-3 border-t border-gray-100 flex justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#8c1a3c] transition-colors cursor-pointer"
              >
                Close
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}