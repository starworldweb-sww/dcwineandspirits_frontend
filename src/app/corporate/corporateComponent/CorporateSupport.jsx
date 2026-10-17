import Image from "next/image";

const MAROON = "#98022e";

const EMAIL = "contact@dcwineandspirits.com";
const PHONE = "(202) 459-8489";
const PHONE_LINK = "+12024598489";

const CorporateSupport = () => {
  return (
    <section className="bg-white py-8 md:py-12 px-3 2xl:px-32 font-hind-madurai">
      <div className="max-w-[1000px] mx-auto grid md:grid-cols-[2fr_3fr] overflow-hidden rounded-xl bg-[#eeeeee] shadow-md">
        <div className="relative min-h-[180px] md:min-h-[280px]">
          <Image
            src="/corporate/womensupport.jpg"
            alt="Corporate gifting consultant ready to help"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover object-[60%_center]"
          />
        </div>

        <div className="flex flex-col justify-center px-6 py-6 md:px-10 md:py-8">
          <span
            className="mb-2 text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: MAROON }}
          >
            Dedicated Support
          </span>

          <h2 className="font-sarabun text-xl font-bold text-[#1c1f22] md:text-[28px]">
            Your consultant is always available
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-[#555]">
            From choosing the right bottles to custom engraving and bulk
            delivery, our corporate gifting consultant is here to help you at
            every step.
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className="group flex items-center gap-3 no-underline"
            >
              <span
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-white transition-colors group-hover:bg-[#7a0225]"
                style={{ backgroundColor: MAROON }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              <span>
                <span className="block text-[11px] uppercase tracking-widest text-[#555]">
                  Email us
                </span>
                <span className="block text-sm font-semibold text-[#1c1f22] transition-colors group-hover:text-[#7a0225] md:text-base">
                  {EMAIL}
                </span>
              </span>
            </a>

            <a
              href={`tel:${PHONE_LINK}`}
              className="group flex items-center gap-3 no-underline"
            >
              <span
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-white transition-colors group-hover:bg-[#7a0225]"
                style={{ backgroundColor: MAROON }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <span>
                <span className="block text-[11px] uppercase tracking-widest text-[#555]">
                  Call us
                </span>
                <span className="block text-sm font-semibold text-[#1c1f22] transition-colors group-hover:text-[#7a0225] md:text-base">
                  {PHONE}
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateSupport;