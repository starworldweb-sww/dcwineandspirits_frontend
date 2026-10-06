"use client";

import { useEffect, useRef } from "react";

export default function GoogleCustomerReviewsOptIn({
  orderId,
  customerEmail,
  deliveryCountry,
  estimatedDeliveryDate,
}) {
  const didRender = useRef(false);

  useEffect(() => {
    if (!orderId || !customerEmail || !deliveryCountry || !estimatedDeliveryDate) {
      console.warn("GCR: missing params", { orderId, customerEmail, deliveryCountry, estimatedDeliveryDate });
      return;
    }
    if (didRender.current) return; // sirf ek baar render
    didRender.current = true;

    const params = {
      merchant_id: 134543542,
      order_id: String(orderId),
      email: customerEmail,
      delivery_country: deliveryCountry,
      estimated_delivery_date: estimatedDeliveryDate,
    };
    console.log("GCR opt-in params:", params);

    const render = () =>
      window.gapi.load("surveyoptin", () => window.gapi.surveyoptin.render(params));

    // Script pehle se load hai to seedha render
    if (window.gapi) {
      render();
      return;
    }

    window.renderOptIn = render;
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js?onload=renderOptIn";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    // cleanup me script remove NAHI kar rahe
  }, [orderId, customerEmail, deliveryCountry, estimatedDeliveryDate]);

  return null;
}