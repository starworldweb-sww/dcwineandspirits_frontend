"use client";

import { useEffect } from "react";

// Props: success page se order ka real data aayega
// orderId: string
// customerEmail: string
// deliveryCountry: 2-letter code, jaise "US"
// estimatedDeliveryDate: format "YYYY-MM-DD"
export default function GoogleCustomerReviewsOptIn({
  orderId,
  customerEmail,
  deliveryCountry,
  estimatedDeliveryDate,
}) {
  useEffect(() => {
    // Step 1: Google script load hone se pehle callback define karna zaroori hai
    window.renderOptIn = function () {
      window.gapi.load("surveyoptin", function () {
        window.gapi.surveyoptin.render({
          // REQUIRED FIELDS
          merchant_id: 134543542,
          order_id: orderId,
          email: customerEmail,
          delivery_country: deliveryCountry,
          estimated_delivery_date: estimatedDeliveryDate,
        });
      });
    };

    // Step 2: Google ki platform.js script page par add karo
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js?onload=renderOptIn";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Step 3: page chhodte waqt cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, [orderId, customerEmail, deliveryCountry, estimatedDeliveryDate]);

  return null; // UI kuch render nahi karta, Google apna popup khud dikhata hai
}