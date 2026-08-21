import React from "react";
import { Phone, Mail } from "lucide-react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";

const ACCENT = "#8c1a3c";

export const metadata = {
  title: "Delivery & Shipping Policy - DC Wine & Spirits",
  description:
    "You must be at least 21 years of age to purchase wine or spirits. By placing an order through our website",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/shipping-and-delivery-policy/",
  },
};
const breadcrumbs = [
  {
    label: "Shipping & Delivery Policy",
    href: "/shipping-and-delivery-policy/",
  },
];

// 1. Same-day delivery cities list - alag rakha taaki wrap clean rahe
const sameDayCities = [
  "Ashburn",
  "Sterling",
  "Herndon",
  "Reston",
  "Tysons",
  "Falls Church",
  "Arlington",
  "Leesburg",
  "Potomac",
  "McLean",
  "Vienna",
  "Oakton",
  "Fairfax",
  "Great Falls",
  "Pimmit Hills",
  "Clifton",
  "Chantilly",
  "Centreville",
  "Annandale",
];

// 2. Reusable section wrapper - maroon left border + heading, jaisa FAQ page mein tha
const PolicySection = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-[16px] font-hind-madurai font-bold tracking-wide text-[#333333] uppercase pb-3 mb-4 border-b border-[#333333] inline-block">
      {title}
    </h2>
    <div
      className="border-l-4 pl-4 mt-2 text-[14px] font-hind-madurai text-[#444444] leading-[1.8] space-y-3"
      style={{ borderColor: ACCENT }}
    >
      {children}
    </div>
  </section>
);

const page = () => {
  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader
        categoryName="Shipping & Delivery Policy"
        breadcrumbs={breadcrumbs}
      />

      <div className="w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14 font-hind-madurai">
        <div className="max-w-4xl">
          {/* --- Age Requirement --- */}
          <PolicySection title="Age Requirement">
            <p>
              You must be at least 21 years of age to purchase wine or spirits.
              By placing an order through our website, you are representing
              yourself to us as at least 21 years of age. We reserve the right
              to ask for proof of identity before processing an order.
            </p>
            <p>
              An adult (over the age of 21) signature with proof of age
              verification is required at the time of delivery. Please be aware
              that someone over the age of 21 must be available to sign for the
              package. If no one is available at the time of delivery, the
              package will not be left.
            </p>
            <p>We do not ship wine to PO Boxes or APO addresses.</p>
          </PolicySection>

          {/* --- Delivery Options --- */}
          <PolicySection title="Delivery Options">
            <p className="font-semibold text-[#333333]">
              Carrier and Delivery Times
            </p>
            <p>
              We use UPS as our main shipper of alcoholic beverages outside of
              VA. We use their Ground, Next Day Air, and 2nd Day Air service:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Ground Service - approximately 1-7 business days in transit
              </li>
              <li>3 Day Select - 3 business days in transit</li>
            </ul>
            <p>
              All orders will be confirmed via e-mail and processed within 2
              business days. We will contact you by the end of the next business
              day if there are any problems with your order. You will be
              promptly notified by e-mail of any unexpected delays in processing
              and/or shipping.
            </p>
            <p>
              During times of bad weather (including excessive heat or cold), we
              recommend using 3 Day Select to avoid spoilage.
            </p>
          </PolicySection>

          {/* --- Same Day Delivery --- */}
          <PolicySection title="Same Day Delivery">
            <p>
              We also provide same day delivery in some cities of Virginia and
              Washington, DC. Same Day Delivery Fee will be $50 and order must
              be placed before 2:00pm EST.
            </p>
            <p className="font-semibold text-[#333333]">
              List of cities for same day delivery:
            </p>
            <div className="flex flex-wrap gap-2">
              {sameDayCities.map((city) => (
                <span
                  key={city}
                  className="bg-[#eeeeee] text-[13px] px-3 py-1.5 rounded-[4px] text-[#444444]"
                >
                  {city}
                </span>
              ))}
            </div>
          </PolicySection>

          {/* --- Delivery within VA & DC --- */}
          <PolicySection title="Delivery within VA & DC">
            <p>
              We try to deliver the gift box the same day as long as it is
              ordered by 2 PM. We charge $15 to $60 for delivery. An adult (over
              the age of 21) signature is required for delivery.
            </p>
          </PolicySection>

          {/* --- Shipping Notes & Restrictions --- */}
          <PolicySection title="Shipping Notes & Restrictions">
            <p>
              An adult signature (over the age of 21) with proof of age
              verification is required for delivery. Any request made to leave a
              package without the signature will be ignored, and no exceptions
              will be made.
            </p>
            <p>
              If you are unable to sign for your wine at the time of delivery,
              you can arrange to pick up your package at your local UPS
              facility. UPS will generally hold a package for 5 business days
              for will-call pickup.
            </p>
            <p>
              All shipping charges are nonrefundable if packages are returned
              due to incorrect addresses or unavailable receivers. There will
              also be a reshipping fee if the package needs to be reshipped or a
              change of address must be made.
            </p>
            <p>
              Due to state laws, we cannot ship alcohol to UT and DE. Additional
              restrictions may apply in MS, AL, AR, OK, IA, KS, and other
              states.
            </p>
          </PolicySection>

          {/* --- Billing Information --- */}
          <PolicySection title="Billing Information">
            <p>
              Orders placed on this website are not final. Your credit card is
              not charged automatically. A charge is put on your credit card
              after the product has been packed and the order is deemed
              complete.
            </p>
            <p>
              Please note that all credit cards are verified. You must provide a
              billing address that corresponds to the credit card you are using.
              If the billing address does not match the credit card, you will be
              informed and the order will not be processed until we hear from
              you.
            </p>
          </PolicySection>

          {/* --- Seasonal Note --- */}
          <div className="bg-[#eeeeee] rounded-[4px] p-5 mb-10">
            <p className="text-[13.5px] font-hind-madurai text-[#444444] italic">
              Note: In the event that there is a seasonal shortage of any
              item(s), an item(s) of equal or greater value will be replaced.
            </p>
          </div>

          {/* --- Questions / Contact --- */}
          <div className="bg-[#eeeeee] rounded-[4px] p-6 md:p-8">
            <h2 className="text-[18px] font-hind-madurai font-semibold text-[#333333] pb-3 mb-4 border-b border-[#333333] inline-block">
              Questions?
            </h2>
            <p className="text-[14px] font-hind-madurai text-[#444444] mb-4">
              If you have any further questions about our shipping policy,
              please feel free to contact us.
            </p>
            <div className="flex flex-col gap-2.5 text-[13.5px] font-hind-madurai text-[#444444]">
              <div className="flex items-center gap-2">
                <Phone size={15} style={{ color: ACCENT }} />
                <a href="tel:2024598489" className="hover:opacity-80">
                  202-459-8489
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} style={{ color: ACCENT }} />
                <a
                  href="mailto:contact@dcwineandspirits.com"
                  className="hover:opacity-80"
                >
                  contact@dcwineandspirits.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
