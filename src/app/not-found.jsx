import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full min-h-[50vh] flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-md text-center">
        <p className="font-sarabun text-6xl sm:text-7xl font-semibold text-[#98022e] leading-none">
          404
        </p>

        <h1 className="font-sarabun mt-4 text-xl sm:text-2xl font-bold text-[#1c2b4b]">
          Page Not Found
        </h1>

        <p className="font-hind-madurai mt-3 text-sm sm:text-[15px] text-gray-500 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-wide text-xs sm:text-sm px-6 py-3 transition-all hover:rounded-xl"
          >
            <Home size={15} />
            Back to Home
          </Link>

          <Link
            href="/products/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#98022e] text-[#98022e] hover:bg-[#98022e] hover:text-white font-bold uppercase tracking-wide text-xs sm:text-sm px-6 py-3 transition-all hover:rounded-xl"
          >
            <Search size={15} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}