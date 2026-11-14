import BulkOrderDetailsClient from "./BulkOrderDetailsClient";

export const metadata = {
  title: "My Bulk Orders | DC Wine & Spirits",
  description:
    "Shop at DC Wine & Spirits wide selection of wine and champagne gifts. Visit our online store for fast delivery, great prices & best bulk order customer service in USA.",
  alternates: {
    canonical: "https://www.dcwineandspirits.com/account/bulk-orders/",
  },
};
const page = () => {
  return <BulkOrderDetailsClient />;
};

export default page;