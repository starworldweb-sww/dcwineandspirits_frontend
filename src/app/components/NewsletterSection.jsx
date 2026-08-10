"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/app/components/ui/Modal";
import PrivacyPolicyContent from "@/app/components/ui/PrivacyPolicyContent";
import { useNewsletterSubscribe } from "../api/hooks/newsletter/useNewletter";


export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const newsletterMutation = useNewsletterSubscribe();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!agreed) {
      toast.error("Please agree to the Privacy Policy before subscribing.");
      return;
    }

    toast.promise(
      newsletterMutation.mutateAsync(email).then((result) => {
        if (!result.success) {
          throw new Error(result.message);
        }
        setEmail("");
        setAgreed(false);
        return result;
      }),
      {
        loading: "Subscribing...",
        success: (result) => result.message,
        error: (err) => err.message || "Something went wrong. Please try again later.",
      }
    );
  };

  return (
    <section className="w-full bg-[#E9E9E9]">
      <div className="px-3 2xl:px-32 py-12 text-center">
        <h2 className="text-3xl md:text-4xl text-gray-700">
          Let's Stay In Touch
        </h2>
        <div className="mx-auto mt-3 h-[2px] w-16 bg-[#b8225a]" />

        <p className="mx-auto mt-4 max-w-xl text-sm md:text-base text-gray-700">
          Stay up to date with news and promotions by signing up for our
          newsletter. Get a $10 discount on your first order.
        </p>

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
            disabled={newsletterMutation.isPending}
            className="w-full flex-1 border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-500 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={newsletterMutation.isPending}
            className="flex items-center justify-center gap-2 bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#98022e] hover:rounded-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Mail size={16} />
            {newsletterMutation.isPending ? "Sending..." : "Send"}
          </button>
        </form>

        <label className="mx-auto mt-4 flex max-w-md items-center justify-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4 w-4 border-gray-400 cursor-pointer"
          />
          <span>
            I have read and agree to the{" "}
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="underline font-medium text-[#b8225a] hover:opacity-80 transition-opacity cursor-pointer"
            >
              Privacy Policy
            </button>
          </span>
        </label>
      </div>

      {/* ================= PRIVACY POLICY MODAL ================= */}
      <Modal
        open={isPrivacyModalOpen}
        onOpenChange={setIsPrivacyModalOpen}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </Modal>
    </section>
  );
}