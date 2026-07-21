"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

// 1. Newsletter signup section - "Let's Stay In Touch"
export default function NewsletterSection() {
  // 2. Form state - email input + the "agree to privacy policy" checkbox
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  // 3. Handles the form submit - replace the console.log with your real
  // newsletter API call (e.g. a useSubscribeNewsletter hook)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!agreed) {
      alert("Please agree to the Privacy Policy before subscribing.");
      return;
    }

    console.log("Subscribing email:", email);
    // TODO: call your newsletter API here
  };

  return (
    <section className="w-full bg-[#E9E9E9]">
      {/* 4. Padding convention applied here */}
      <div className="px-3 2xl:px-32 py-12 text-center">
        {/* 5. Heading + small underline */}
        <h2 className="text-3xl md:text-4xl text-gray-700">
          Let's Stay In Touch
        </h2>
        <div className="mx-auto mt-3 h-[2px] w-16 bg-[#b8225a]" />

        {/* 6. Subtext */}
        <p className="mx-auto mt-4 max-w-xl text-sm md:text-base text-gray-700">
          Stay up to date with news and promotions by signing up for our
          newsletter. Get a $10 discount on your first order.
        </p>

        {/* 7. Email input + send button - stacked on mobile, inline from sm up */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full flex-1 border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-500"
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 cursor-pointer"
          >
            <Mail size={16} />
            Send
          </button>
        </form>

        {/* 8. Privacy policy checkbox */}
        <label className="mx-auto mt-4 flex max-w-md items-center justify-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4 w-4 border-gray-400 cursor-pointer"
          />
          <span>
            I have read and agree to the{" "}
            <a href="/privacy-policy" className="text-[#b8225a] hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>
      </div>
    </section>
  );
}