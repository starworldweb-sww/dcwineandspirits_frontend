"use client";

import React from "react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";

// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

const breadcrumbs = [
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const sections = [
  {
    title: "Aggregate Information (non-personally identifiable)",
    content: (
      <>
        DCWINEANDSPIRITS.COM respects each individual user&apos;s right to
        privacy. We do not collect personal identifying information unless
        such information is specifically and knowingly provided from users
        during contests, site registration, or for shipping and delivery.
      </>
    ),
  },
  {
    title: "Registration",
    content: <>No registration is required in order to use this website.</>,
  },
  {
    title: "Third-Party Offers or Mailing Lists",
    content: (
      <>
        You may receive information regarding products, new features,
        services newsletters (ours or a third party&apos;s) and special
        offers we think you&apos;ll find valuable. We may also share
        information with very few selected business partners.
      </>
    ),
  },
  {
    title: "Security",
    content: (
      <>
        We take decent precautions to keep the personal information
        disclosed to us secure. However, we are not responsible for any
        breach of security.
      </>
    ),
  },
  {
    title: "Cookies",
    content: (
      <>
        Non-personal information and data may be automatically collected
        through the standard operation of our website servers (i.e. log
        file information like IP address) or through the use of
        &quot;cookies.&quot; Cookies are small text files that our site
        places on your computer&apos;s hard drive to recognize repeat users
        and facilitate the user&apos;s use of the site. Also, our cookies
        allow a site to track usage behavior and compile aggregate data for
        content improvement, targeted advertising, and marketing and
        promotional purposes.
      </>
    ),
  },
  {
    title: "Attention Kids!",
    content: (
      <>
        No information should be submitted to our website by children under
        21 years of age without their parent&apos;s or guardian&apos;s
        consent. We do not monitor the age of our user audience. We do not
        sell or deliver to anyone under 21, and we require valid ID while
        picking up an order or receiving a delivery.
      </>
    ),
  },
  {
    title: "Right to Change at Any Time",
    content: (
      <>
        DCWINEANDSPIRITS.COM reserves the right to change this policy at
        any time by posting notice of a new privacy statement. This
        statement and the policies outlined herein are not intended to and
        do not create any contractual or other legal rights in or on behalf
        of any party.
      </>
    ),
  },
];

const PrivacyClient = () => {
  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="Privacy Policy" breadcrumbs={breadcrumbs} />

      <div className="w-full px-3 lg:px-3 2xl:px-32 py-12">
        <div className="max-w-[900px]">
          {sections.map((section, index) => (
            <div key={index} className="mb-8">
              <h2
                className="text-[19px] font-hind-madurai font-semibold text-[#333333] pb-2 mb-3 border-b"
                style={{ borderColor: ACCENT }}
              >
                {section.title}
              </h2>
              <p className="text-[14px] font-hind-madurai text-[#555555] leading-[1.8]">
                {section.content}
              </p>
            </div>
          ))}

          {/* Note callout */}
          <div
            className="rounded-[4px] px-5 py-4 mt-10 text-[14px] font-hind-madurai text-[#555555] leading-[1.8]"
            style={{ backgroundColor: "#f7f0f2", borderLeft: `3px solid ${ACCENT}` }}
          >
            <strong style={{ color: ACCENT }}>Note:</strong> In the event
            that there is a seasonal shortage of any item(s), an item(s) of
            equal or greater value will be replaced.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyClient;