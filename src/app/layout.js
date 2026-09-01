import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Navbar from "./components/Navbar";
import Stickynav from "./components/navcomponents/StickyNav";
import OccasionBar from "./components/navcomponents/OccasionsBar";
import Topline from "./components/navcomponents/Topline";
import PhoneHeader from "./components/navcomponents/Phoneheader";
import GoToTopButton from "./components/GoToTopButton";
import MobileNavbar from "./components/navcomponents/MobileNav";
import Footer from "./components/Footer";
import Provider from "./components/Provider";
import { Sumana, Hind_Madurai, Sarabun } from "next/font/google";
import { Toaster } from "sonner";
import { getQueryClient } from "@/libs/get-query-client";
import { getMobileCategories } from "./api/services/mobileCategoryService";
import { mobileCategoryKeys } from "@/libs/queryKeys";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ProductViewTabs from "./components/ProductViewsTabs";
import AgeVerificationGate from "./components/AgeVerification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const sumana = Sumana({
  subsets: ["latin"],
  weight: ["400", "700"], 
  variable: "--font-sumana",
});

const hindMadurai = Hind_Madurai({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-madurai",
});

const sarabun = Sarabun({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DC Wine & Spirits - Best Online Wine Gift Store",
  description:
    "Shop at DC Wine & Spirits wide selection of wine and champagne gifts. Visit our online store for fast delivery, great prices & best customer service in USA.",
  robots: {
    other: "max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  },
  alternates: {
    canonical: `https://www.dcwineandspirits.com/`,
  },
  openGraph: {
    type: "website",
    url: "https://www.dcwineandspirits.com/",
    title: "DC Wine & Spirits - Best Online Wine Gift Store",
    description:
      "Shop at DC Wine & Spirits wide selection of wine and champagne gifts. Visit our online store for fast delivery, great prices & best customer service in USA.",
    siteName: "DC Wine & Spirits",
    images: [
      {
        url: "https://www.dcwineandspirits.com/image/cache/catalog/logo/dcwineandspirits-logo-1200x630-600x315.webp",
        width: 600,
        height: 315,
        alt: "DC Wine & Spirits Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image", 
    site: "@dcwine_spirits", 
    title: "DC Wine & Spirits - Best Online Wine Gift Store",
    description:
      "Shop at DC Wine & Spirits wide selection of wine and champagne gifts. Visit our online store for fast delivery, great prices & best customer service in USA.",
    images: [
      "https://www.dcwineandspirits.com/image/cache/catalog/logo/dcwineandspirits-logo-1200x630-200x200h.webp",
    ],
  },
};



export default async function RootLayout({ children }) {

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: mobileCategoryKeys.list(),
      queryFn: getMobileCategories,
    }),

  ]);
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sumana.variable} ${hindMadurai.variable} ${sarabun.variable} h-full antialiased`}
    >
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PKSMBZ5');
          `}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body
        className="min-h-full flex flex-col"
        suppressHydrationWarning={true}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PKSMBZ5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}


        <Provider>
          <GoToTopButton />
          <AgeVerificationGate />
          <PhoneHeader />
          <Topline />
          <Navbar />

          <HydrationBoundary state={dehydrate(queryClient)}>
            <MobileNavbar />
          </HydrationBoundary>

          <Stickynav />
          {children}
          <Toaster position="top-right" richColors />
          <ProductViewTabs />
          <Footer />
        </Provider>
      </body>
    </html>
  );
}