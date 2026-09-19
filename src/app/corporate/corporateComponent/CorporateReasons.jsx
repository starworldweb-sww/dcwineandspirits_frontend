"use client";

const ACCENT = "#98022e";

const REASON_COLUMNS = [
  {
    heading: "Staff & Team Members",
    items: [
      { label: "Reward Hard Work", accent: true },
      { label: "Welcome Aboard", accent: false },
      { label: "Sales Incentives", accent: true },
      { label: "Work Anniversary", accent: false },
      { label: "Promotions", accent: true },
      { label: "Festive Season", accent: false },
      { label: "Get Well Soon", accent: true },
      { label: "Employee of the Month", accent: false },
      { label: "New Baby", accent: true },
      { label: "Team Celebration", accent: false },
      { label: "Farewell", accent: true },
      { label: "Sympathy", accent: false },
    ],
  },
  {
    heading: "Customers & Business Partners",
    items: [
      { label: "Referral Thank You", accent: true },
      { label: "Deal Settlement", accent: false },
      { label: "Welcome Gifts", accent: true },
      { label: "Closing a Deal", accent: false },
      { label: "Year-End Wrap Up", accent: true },
      { label: "Holiday Season", accent: false },
      { label: "Christmas & New Year", accent: true },
      { label: "Condolences", accent: false },
      { label: "Get Well Soon", accent: true },
      { label: "New Business Launch", accent: false },
      { label: "Apologies", accent: true },
      { label: "Simple Thank You", accent: false },
    ],
  },
  {
    heading: "Events, Seminars & Conferences",
    items: [
      { label: "Speaker Gifts", accent: true },
      { label: "Event Giveaways", accent: false },
      { label: "Team Building Events", accent: true },
      { label: "Team Leaders", accent: false },
      { label: "Team Rewards", accent: true },
      { label: "Work Achievements", accent: false },
      { label: "Congratulations", accent: true },
      { label: "Appreciation Gifts", accent: false },
      { label: "With Thanks", accent: true },
      { label: "Prize Giving", accent: false },
      { label: "Organiser Gifts", accent: true },
      { label: "Milestone Gifting", accent: false },
    ],
  },
];

export default function CorporateReasons({
  imageSrc = "/corporate/dcReasons.png",
}) {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-white
        py-16
        md:py-16
        lg:py-12
        font-hind-madurai
      "
    >
      {/* ================= BACKGROUND IMAGE ================= */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url("${imageSrc}")`,
            backgroundPosition: "left center",
            backgroundSize: "auto 100%",
          }}
        />

        {/* Soft white overlay for readability */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-white/20
            via-white/75
            to-white/95
          "
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div
        className="
          relative
          z-10
          max-w-[1400px]
          mx-auto
          px-5
          sm:px-8
          lg:px-10
        "
      >
        {/* ================= HEADING ================= */}
        <div className="mb-10 md:mb-8 lg:mb-6 text-center lg:text-left lg:ml-[360px]">
          <p
            className="
              italic
              text-xl
              md:text-2xl
              lg:text-3xl
              font-semibold
              mb-1
            "
            style={{
              color: ACCENT,
              fontFamily: "'cambriaregular', Georgia, serif",
            }}
          >
            There are so many
          </p>

          <h2
            className="
              text-2xl
              md:text-3xl
              lg:text-[38px]
              font-bold
              text-[#1c1f22]
              leading-tight
            "
            style={{
              fontFamily: "'cambriaregular', Georgia, serif",
            }}
          >
            Reasons for Corporate Gifting
          </h2>

          {/* Small accent line */}
          <div
            className="
              mt-4
              h-[2px]
              w-16
              mx-auto
              lg:mx-0
            "
            style={{ backgroundColor: ACCENT }}
          />
        </div>

        {/* ================= THREE COLUMNS ================= */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-x-8
            xl:gap-x-12
            gap-y-10
            lg:gap-y-6
            lg:ml-[360px]
          "
        >
          {REASON_COLUMNS.map((col, index) => (
            <div
              key={col.heading}
              className={`
                relative
                ${
                  index !== 0
                    ? "lg:border-l lg:border-[#98022e]/20 lg:pl-8"
                    : ""
                }
              `}
            >
              {/* Column heading */}
              <h3
                className="
                  text-lg
                  md:text-xl
                  lg:text-[21px]
                  font-bold
                  text-[#1c1f22]
                  mb-5
                  lg:mb-3
                  leading-snug
                "
                style={{
                  fontFamily: "'cambriaregular', Georgia, serif",
                }}
              >
                {col.heading}
              </h3>

              {/* Items */}
              <ul className="space-y-2.5 lg:space-y-1.5">
                {col.items.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-start gap-2.5"
                  >
                    {/* Bullet */}
                    <span
                      className="
                        mt-[7px]
                        w-[6px]
                        h-[6px]
                        rounded-full
                        shrink-0
                      "
                      style={{
                        backgroundColor: item.accent
                          ? ACCENT
                          : "#1c1f22",
                      }}
                    />

                    {/* Text */}
                    <span
                      className="
                        text-sm
                        md:text-[15px]
                        lg:text-[15px]
                        font-semibold
                        leading-snug
                      "
                      style={{
                        color: item.accent
                          ? ACCENT
                          : "#1c1f22",
                      }}
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}