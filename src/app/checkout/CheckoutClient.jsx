"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Truck,
  CreditCard,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import Modal from "@/app/components/ui/Modal";
import PrivacyPolicyContent from "@/app/components/ui/PrivacyPolicyContent";
import TermsAndConditions from "@/app/components/ui/TermsAndConditions";
import { useCountryget } from "../api/hooks/customerAddress/useCountryget";
import { useZoneget } from "../api/hooks/customerAddress/useZoneget";
import { useGetCartList } from "../api/hooks/cart/useGetCartList";
import { useClearCart } from "../api/hooks/cart/useClearCart";
import { useUser } from "../api/hooks/useAuth";
import { usePlaceOrder } from "../api/hooks/checkout/usePlaceOrder";
import { useCreatePaymentIntent } from "../api/hooks/checkout/useCreatePaymentIntent";
import { useshippingRate } from "../api/hooks/useShippingRate";

const ACCENT = "#8c1a3c";
const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Shopping Cart", href: "/account/cart" },
  { label: "Checkout", href: "/checkout" },
];

const SectionHeader = ({ title }) => (
  <div className="mb-6">
    <h2
      className={`font-sarabun text-[15px] md:text-[17px] font-bold text-[#333333] uppercase tracking-wider`}
    >
      {title}
    </h2>
    <div className="h-[1px] w-12 mt-1" style={{ backgroundColor: ACCENT }} />
  </div>
);

const inputClass =
  "w-full border border-gray-200 py-2 px-3 rounded-[3px] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#8c1a3c] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed";

const labelClass = "block text-[13px] font-medium mb-1";
const requiredStar = <span className="text-red-500">*</span>;

const SHIPPING_METHODS_FALLBACK = [
  {
    id: "flat",
    code: "flat.flat",
    name: "Flat Shipping Rate",
    label: "Standard Delivery (Delivery may take 2 to 3 days)",
    cost: 20.0,
  },
  {
    id: "same_day",
    code: "flat.same_day",
    name: "Same Day Delivery",
    label:
      "Same Day Delivery (Only in DC and Northern VA, order must be before 2:00PM)",
    cost: 100.0,
  },
];

const PAYMENT_METHODS = [
  {
    code: "stripe",
    method: "Credit / Debit Card",
  },
  // {
  //   code: "cod",
  //   method: "Cash On Delivery",
  // },
];

const EMPTY_BILLING = {
  firstname: "",
  lastname: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  postcode: "",
  country_id: "223",
  zone_id: "",
  email: "",
  telephone: "",
};

const EMPTY_SHIPPING = {
  firstname: "",
  lastname: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  postcode: "",
  country_id: "223",
  zone_id: "",
  telephone: "",
};

const EMPTY_REGISTER = {
  firstname: "",
  lastname: "",
  email: "",
  telephone: "",
  password: "",
  confirm: "",
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder-product.png";
  if (imagePath.startsWith("http")) return imagePath;
  const backendUrl =
    process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL || "https://www.dcwineandspirits.com/image/";
  const cleanPath = imagePath.startsWith("/")
    ? imagePath.slice(1)
    : imagePath;
  return `${backendUrl}/${cleanPath}`;
};

const StripePaymentForm = ({ onSubmitReady, isProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (stripe && elements) {
      onSubmitReady({ stripe, elements });
    }

  }, [stripe, elements]);


  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-[3px] p-4 bg-white">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>
      <p className="text-[12px] text-gray-500 flex items-center gap-2">
        <CreditCard size={14} className="text-gray-400" />
        Secured by Stripe — your payment information is encrypted and safe.
      </p>
    </div>
  );
};

const MISSING_ORDER_KEY = "checkout_missing_order";

const CheckoutClient = () => {
  const router = useRouter();

  const { data: countryData = [] } = useCountryget();
  const { data: user, isLoading: userLoading } = useUser();
  const { data: cartRaw, isLoading: cartLoading } = useGetCartList();
  const stripeCtxRef = useRef({ stripe: null, elements: null });

  const getZones = useZoneget();
  const placeOrderMut = usePlaceOrder();
  const createPIMut = useCreatePaymentIntent();
  const clearCartMut = useClearCart();

  const [checkoutType, setCheckoutType] = useState("guest");
  const [registerData, setRegisterData] = useState(EMPTY_REGISTER);

  const [billing, setBilling] = useState(EMPTY_BILLING);
  const [billingZones, setBillingZones] = useState([]);

  const [shippingSameAsBilling, setShippingSameAsBilling] = useState(false);
  const [shipping, setShipping] = useState(EMPTY_SHIPPING);

  const [shippingZones, setShippingZones] = useState([]);

  const [shippingMethodId, setShippingMethodId] = useState(
    SHIPPING_METHODS_FALLBACK[0].id
  );
  const [paymentCode, setPaymentCode] = useState(PAYMENT_METHODS[0].code);

  const [coupon, setCoupon] = useState("");
  const [giftCert, setGiftCert] = useState("");
  const [supportTeam, setSupportTeam] = useState("no");

  const [orderNote, setOrderNote] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const [stripeCtx, setStripeCtx] = useState({
    stripe: null,
    elements: null,
  });
  const [stripePromise] = useState(() =>
    STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null
  );
  const [clientSecret, setClientSecret] = useState(null);
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);

  const [missingOrderId, setMissingOrderId] = useState(null);

  const isLoggedIn = !!user?.data?.customer_id;


  useEffect(() => {
    stripeCtxRef.current = stripeCtx;
  }, [stripeCtx]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MISSING_ORDER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.missing_order_id) {
          setMissingOrderId(parsed.missing_order_id);
        }
      }
    } catch (e) {
      console.warn("Could not read missing order from storage:", e.message);
    }
  }, []);
  useEffect(() => {
    const loadDefaultZones = async () => {
      try {
        const bZones = await getZones.mutateAsync(EMPTY_BILLING.country_id);
        const billingZoneList = bZones || [];
        setBillingZones(billingZoneList);
        if (!billing.zone_id && billingZoneList.length > 0) {
          const defaultBillingZone = billingZoneList?.zone_id;
          setBilling((prev) => ({ ...prev, zone_id: defaultBillingZone }));
          if (shippingSameAsBilling) {
            setShipping((prev) => ({ ...prev, zone_id: defaultBillingZone }));
          }
        }

        if (!shippingSameAsBilling) {
          const sZones = await getZones.mutateAsync(EMPTY_SHIPPING.country_id);
          const shippingZoneList = sZones || [];
          setShippingZones(shippingZoneList);
          if (!shipping.zone_id && shippingZoneList.length > 0) {
            setShipping((prev) => ({ ...prev, zone_id: shippingZoneList?.zone_id }));
          }
        } else {
          setShippingZones(billingZoneList);
        }
      } catch (e) {
        console.warn("Could not load default zones:", e.message);
      }
    };
    loadDefaultZones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoggedIn && !userLoading) {
      const u = user.data;
      setBilling((prev) => ({
        ...prev,
        firstname: u.firstname || prev.firstname,
        lastname: u.lastname || prev.lastname,
        email: u.email || prev.email,
        telephone: u.telephone || prev.telephone,
      }));
      setRegisterData({
        firstname: u.firstname || "",
        lastname: u.lastname || "",
        email: u.email || "",
        telephone: u.telephone || "",
        password: "",
        confirm: "",
      });
      setCheckoutType("login");
    }
  }, [isLoggedIn, userLoading, user]);

  const cartItems = useMemo(() => {
    if (!cartRaw?.items) return [];
    return cartRaw.items.map((item) => {
      const prod = item.product || {};
      const price = prod.special_price != null ? prod.special_price : prod.price;
      const unitPrice = Number(price || 0);
      const optionTotal =
        item.selected_options?.reduce(
          (sum, o) => sum + Number(o.price || 0),
          0
        ) || 0;
      const finalUnitPrice = unitPrice + optionTotal;
      return {
        cart_id: item.cart_id,
        product_id: item.product_id,
        name: prod.name || "Product",
        slug: prod.slug || "#",
        model: prod.model || "",
        image: getImageUrl(prod.image),
        quantity: Number(item.quantity || 1),
        unitPrice: finalUnitPrice,
        total: finalUnitPrice * Number(item.quantity || 1),
        tax: 0,
        reward: 0,
        selected_options: item.selected_options || [],
        option: (item.selected_options || []).map((o) => ({
          option_id: o.option_id,
          option_value_id: o.option_value_id || 0,
          option_name: o.option_name,
          value: o.value,
          type: o.type,
        })),
      };
    });
  }, [cartRaw]);

  const cartTotalQty = useMemo(
    () => cartItems.reduce((acc, it) => acc + (it.quantity || 0), 0),
    [cartItems]
  );

  const effectiveCountryId = shippingSameAsBilling
    ? billing?.country_id
    : shipping?.country_id;
  const effectiveZoneId = shippingSameAsBilling
    ? billing?.zone_id
    : shipping?.zone_id;

  const { data: shippingRate, isLoading: shippingRateLoading } = useshippingRate({
    countryId: effectiveCountryId,
    zoneId: effectiveZoneId,
    // quantity: cartTotalQty || 1,
  });

  const SHIPPING_METHODS = useMemo(() => {
    if (shippingRate?.allMatches && shippingRate?.allMatches.length > 0) {
      return shippingRate.allMatches.map((match, idx) => ({
        id: `dynamic_${match.chargeNum ?? idx}`,
        code: `multi_flat_rate.multi_flat_rate_0`,
        name: match.title || "Shipping Rate",
        label: match.title || "Shipping",
        cost: Number(match.price || 0),
      }));
    }
    return SHIPPING_METHODS_FALLBACK;
  }, [shippingRate]);
  
  const subTotal = useMemo(
    () => cartItems.reduce((acc, it) => acc + it.total, 0),
    [cartItems]
  );

  const selectedShipping = SHIPPING_METHODS.find(
    (r) => r.id === shippingMethodId
  ) || SHIPPING_METHODS[0];
  const shippingCost = selectedShipping ? selectedShipping.cost*cartTotalQty : 0;
  const total = subTotal + shippingCost;

  useEffect(() => {
    if (SHIPPING_METHODS.length > 0) {
      const hasCurrent = SHIPPING_METHODS.some((r) => r.id === shippingMethodId);
      if (!hasCurrent) {
        setShippingMethodId(SHIPPING_METHODS[0].id);
      }
    }
  }, [SHIPPING_METHODS, shippingMethodId]);

  const loadZones = async (countryId, setZones, onLoaded) => {
    if (!countryId) {
      setZones([]);
      return;
    }
    try {
      const zones = await getZones.mutateAsync(countryId);
      const zoneList = zones || [];
      setZones(zoneList);
      if (onLoaded && zoneList.length > 0) {
        onLoaded(zoneList[0].zone_id);
      }
    } catch (e) {
      setZones([]);
    }
  };

  const setStripeSubmitRef = useCallback(({ stripe, elements }) => {
    setStripeCtx((prev) => {
      if (prev.stripe === stripe && prev.elements === elements) {
        return prev;
      }
      return { stripe, elements };
    });
  }, []);;

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "email" && (checkoutType === "register" || checkoutType === "guest")) {
        setRegisterData((rd) => ({ ...rd, email: value }));
      }
      if (name === "firstname" || name === "lastname") {
        if (checkoutType === "register") {
          setRegisterData((rd) => ({ ...rd, [name]: value }));
        }
      }
      if (name === "telephone" && checkoutType === "register") {
        setRegisterData((rd) => ({ ...rd, telephone: value }));
      }
      return next;
    });
  };

  const handleBillingCountryChange = (e) => {
    const countryId = e.target.value;
    setBilling((prev) => ({ ...prev, country_id: countryId, zone_id: "" }));
    loadZones(countryId, setBillingZones, (firstZoneId) => {
      setBilling((prev) => ({ ...prev, zone_id: firstZoneId }));
      if (shippingSameAsBilling) {
        setShipping((prev) => ({ ...prev, country_id: countryId, zone_id: firstZoneId }));
        setShippingZones(prev => prev);
      }
    });
    if (shippingSameAsBilling) {
      setShipping((prev) => ({ ...prev, country_id: countryId, zone_id: "" }));
    }
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingCountryChange = (e) => {
    const countryId = e.target.value;
    setShipping((prev) => ({ ...prev, country_id: countryId, zone_id: "" }));
    loadZones(countryId, setShippingZones, (firstZoneId) => {
      setShipping((prev) => ({ ...prev, zone_id: firstZoneId }));
    });
  };

  const toggleShippingSameAsBilling = async (checked) => {
    setShippingSameAsBilling(checked);
    if (checked) {
      const bCountry = billing.country_id;
      setShipping({
        firstname: billing.firstname,
        lastname: billing.lastname,
        company: billing.company,
        address_1: billing.address_1,
        address_2: billing.address_2,
        city: billing.city,
        postcode: billing.postcode,
        country_id: bCountry,
        zone_id: billing.zone_id,
        telephone: billing.telephone || "",
      });
      setShippingZones(billingZones);
    } else {
      if (shipping.country_id) {
        try {
          const zones = await getZones.mutateAsync(shipping.country_id);
          const zoneList = zones || [];
          setShippingZones(zoneList);
          if (!shipping.zone_id && zoneList.length > 0) {
            setShipping((prev) => ({ ...prev, zone_id: zoneList[0].zone_id }));
          }
        } catch (e) {
          setShippingZones([]);
        }
      }
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    if (name === "email" || name === "firstname" || name === "lastname" || name === "telephone") {
      setBilling((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateRequired = (obj, requiredFields) => {
    for (const f of requiredFields) {
      if (!obj[f] || String(obj[f]).trim() === "") return false;
    }
    return true;
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));

  const validateBilling = () => {
    const required = [
      "firstname",
      "address_1",
      "city",
      "postcode",
      "country_id",
      "zone_id",
    ];
    if (!validateRequired(billing, required)) {
      toast.error("Please fill in all required billing fields");
      return false;
    }
    if (!billing.email || !validateEmail(billing.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!billing.telephone || String(billing.telephone).trim() === "") {
      toast.error("Please enter a telephone number");
      return false;
    }
    return true;
  };

  const validateShipping = () => {
    if (shippingSameAsBilling) return true;
    const required = [
      "firstname",
      "address_1",
      "city",
      "postcode",
      "country_id",
      "zone_id",
    ];
    if (!validateRequired(shipping, required)) {
      toast.error("Please fill in all required shipping fields");
      return false;
    }
    return true;
  };

  const validateRegister = () => {
    if (checkoutType !== "register") return true;
    const required = ["firstname", "lastname", "email", "telephone", "password"];
    if (!validateRequired(registerData, required)) {
      toast.error("Please fill in all registration fields");
      return false;
    }
    if (registerData.password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return false;
    }
    if (registerData.password !== registerData.confirm) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const findCountryById = (id) =>
    countryData.find((c) => String(c.country_id) === String(id)) ||
    countryData.find((c) => String(c.contery_id) === String(id));

  const findZoneById = (zones, id) =>
    zones.find((z) => String(z.zone_id) === String(id));

  const buildOrderPayload = (extra = {}) => {
    const shippingCountryIdActual = shippingSameAsBilling ? billing.country_id : shipping.country_id;
    const shippingCountryObj = findCountryById(shippingCountryIdActual);
    const billingCountryObj = findCountryById(billing.country_id);
    const shippingZoneList = shippingSameAsBilling ? billingZones : shippingZones;
    const shippingZoneIdActual = shippingSameAsBilling ? billing.zone_id : shipping.zone_id;
    const shippingZoneObj = findZoneById(shippingZoneList, shippingZoneIdActual);
    const billingZoneObj = findZoneById(billingZones, billing.zone_id);

    const shippingFirstNameFinal = shippingSameAsBilling ? billing.firstname : shipping.firstname;
    const shippingLastNameFinal = shippingSameAsBilling ? billing.lastname : shipping.lastname;
    const shippingCompanyFinal = shippingSameAsBilling ? billing.company : shipping.company;
    const shippingAddress1Final = shippingSameAsBilling ? billing.address_1 : shipping.address_1;
    const shippingAddress2Final = shippingSameAsBilling ? billing.address_2 : shipping.address_2;
    const shippingCityFinal = shippingSameAsBilling ? billing.city : shipping.city;
    const shippingPostcodeFinal = shippingSameAsBilling ? billing.postcode : shipping.postcode;
    const shippingCountryIdFinal = shippingCountryIdActual;
    const shippingTelephoneFinal = shippingSameAsBilling ? billing.telephone : shipping.telephone;

    const products = cartItems.map((item) => ({
      product_id: item.product_id,
      name: item.name,
      model: item.model,
      quantity: item.quantity,
      price: item.unitPrice,
      total: item.total,
      tax: item.tax,
      reward: item.reward,
      option: item.option,
      options: item.option,
    }));

    const totals = [
      { code: "sub_total", title: "Sub-Total", value: subTotal, sort_order: 1 },
    ];
    if (shippingCost > 0) {
      totals.push({
        code: "shipping",
        title: selectedShipping?.name || "Shipping",
        value: shippingCost,
        sort_order: 3,
      });
    }
    totals.push({ code: "total", title: "Total", value: total, sort_order: 9 });

    const paymentMethodMeta = PAYMENT_METHODS.find(
      (p) => p.code === paymentCode
    );

    const billingPayload = {
      firstname: billing.firstname,
      lastname: billing.lastname,
      company: billing.company || "",
      address_1: billing.address_1,
      address_2: billing.address_2 || "",
      city: billing.city,
      postcode: billing.postcode || "",
      zone: billingZoneObj?.name || "",
      zone_id: parseInt(billing.zone_id) || 0,
      country: billingCountryObj?.name || "",
      country_id: parseInt(billing.country_id) || 0,
      address_format: "",
      custom_field: {},
    };

    const shippingPayload = {
      firstname: shippingFirstNameFinal,
      lastname: shippingLastNameFinal,
      // telephone: shippingTelephoneFinal || "",
      company: shippingCompanyFinal || "",
      address_1: shippingAddress1Final,
      address_2: shippingAddress2Final || "",
      city: shippingCityFinal,
      postcode: shippingPostcodeFinal || "",
      zone: shippingZoneObj?.name || "",
      zone_id: parseInt(shippingZoneIdActual) || 0,
      country: shippingCountryObj?.name || "",
      country_id: parseInt(shippingCountryIdFinal) || 0,
      address_format: "",
      custom_field: shippingTelephoneFinal
        ? { "1": shippingTelephoneFinal }
        : {},
    };

    return {
      checkoutType: isLoggedIn ? "login" : checkoutType,
      customer:
        checkoutType === "register"
          ? { ...registerData, group_id: 1 }
          : isLoggedIn
            ? user.data
            : null,

      billing: billingPayload,

      shipping: shippingPayload,

      payment_firstname: billingPayload.firstname,
      payment_lastname: billingPayload.lastname,
      payment_company: billingPayload.company,
      payment_address_1: billingPayload.address_1,
      payment_address_2: billingPayload.address_2,
      payment_city: billingPayload.city,
      payment_postcode: billingPayload.postcode,
      payment_zone: billingPayload.zone,
      payment_zone_id: billingPayload.zone_id,
      payment_country: billingPayload.country,
      payment_country_id: billingPayload.country_id,
      payment_address_format: billingPayload.address_format,
      payment_custom_field: billingPayload.custom_field,

      shipping_firstname: shippingPayload.firstname,
      shipping_lastname: shippingPayload.lastname,
      shipping_company: shippingPayload.company,
      shipping_address_1: shippingPayload.address_1,
      shipping_address_2: shippingPayload.address_2,
      shipping_city: shippingPayload.city,
      shipping_postcode: shippingPayload.postcode,
      shipping_zone: shippingPayload.zone,
      shipping_zone_id: shippingPayload.zone_id,
      shipping_country: shippingPayload.country,
      shipping_country_id: shippingPayload.country_id,
      shipping_address_format: shippingPayload.address_format,
      shipping_custom_field: shippingPayload.custom_field,

      payment: {
        method: paymentMethodMeta?.method || "",
        code: paymentCode,
      },
      payment_method: {
        method: paymentMethodMeta?.method || "",
        code: paymentCode,
      },
      payment_code: paymentCode,

      shippingMethod: {
        name: selectedShipping?.name || "",
        code: selectedShipping?.code || "",
        cost: shippingCost,
      },
      shipping_method: selectedShipping?.name || "",
      shipping_code: selectedShipping?.code || "",
      shipping_cost: shippingCost,

      products,
      totals,
      comment: orderNote || "",
      coupon_id: coupon || undefined,
      discountAmount: 0,

      firstname: billing.firstname,
      lastname: billing.lastname,
      email: billing.email,
      telephone: billing.telephone,

      missing_order_id: missingOrderId || undefined,

      ...extra,
    };
  };

  const handleApplyCoupon = () => {
    if (!coupon.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    toast.info("Coupon feature will be available soon");
  };

  const handleApplyGiftCert = () => {
    if (!giftCert.trim()) {
      toast.error("Please enter a gift certificate code");
      return;
    }
    toast.info("Gift certificate feature will be available soon");
  };

  const clearMissingOrder = () => {
    try {
      localStorage.removeItem(MISSING_ORDER_KEY);
    } catch (e) { }
    setMissingOrderId(null);
  };

  const saveMissingOrder = (orderId, stripePI, stripeSecret) => {
    try {
      localStorage.setItem(
        MISSING_ORDER_KEY,
        JSON.stringify({
          missing_order_id: orderId,
          stripe_payment_intent_id: stripePI || null,
          stripe_client_secret: stripeSecret || null,
          savedAt: Date.now(),
        })
      );
      setMissingOrderId(orderId);
    } catch (e) {
      console.warn("Could not save missing order:", e.message);
    }
  };

  const finalizeOrderSuccess = async (orderId) => {
    clearMissingOrder();
    try {
      await clearCartMut.mutateAsync();
    } catch (e) {
      console.warn("Could not clear cart on finalize:", e?.message || e);
    }
    router.push(`/account/order/info?order_id=${orderId}&success=1`);
  };

  const waitForStripeReady = async (timeoutMs = 8000) => {
    return new Promise((resolve) => {
      const start = Date.now();
      const check = () => {
        if (stripeCtxRef.current.stripe && stripeCtxRef.current.elements) {
          resolve(true);
          return;
        }
        if (Date.now() - start > timeoutMs) {
          resolve(false);
          return;
        }
        setTimeout(check, 100);
      };
      check();
    });
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!validateBilling()) return;
    if (!validateShipping()) return;
    if (!validateRegister()) return;
    if (!agreeTerms) {
      toast.error("Please agree to the Terms & Conditions");
      return;
    }

    if (paymentCode === "cod") {
      const payload = buildOrderPayload({ payment_code: "cod" });
      try {
        const result = await placeOrderMut.mutateAsync(payload);
        if (result?.success && result?.data?.order_id) {
          await finalizeOrderSuccess(result.data.order_id);
        }
      } catch (e) { }
      return;
    }

    if (!stripePromise || !STRIPE_PUBLISHABLE_KEY) {
      toast.error("Stripe is not configured");
      return;
    }

    try {
      setIsPreparingPayment(true);

      let workingClientSecret = clientSecret;
      let workingPIId = null;
      let workingOrderId = missingOrderId;

      if (!workingClientSecret) {
        const createOrderPayload = buildOrderPayload();
        const orderResult = await placeOrderMut.mutateAsync(createOrderPayload);
        console.log("orderResult", orderResult)
        if (!orderResult?.success || !orderResult?.data?.order_id) {
          throw new Error(orderResult?.message || "Failed to create order");
        }

        workingOrderId = orderResult.data.order_id;

        if (orderResult.data.stripe_client_secret) {
          workingClientSecret = orderResult.data.stripe_client_secret;
          workingPIId = orderResult.data.stripe_payment_intent_id || null;
        } else {
          const piResult = await createPIMut.mutateAsync({
            amount: total,
            currency: "usd",
            customer_email: billing.email,
            customer_name: `${billing.firstname} ${billing.lastname}`.trim(),
          });
          if (!piResult?.success || !piResult.clientSecret) {
            throw new Error(piResult?.message || "Failed to create payment");
          }
          workingClientSecret = piResult.clientSecret;
          workingPIId = piResult.paymentIntentId || null;
        }

        saveMissingOrder(workingOrderId, workingPIId, workingClientSecret);

        if (workingClientSecret !== clientSecret) {
          setClientSecret(workingClientSecret);
          // await new Promise((r) => setTimeout(r, 500));
        }
      }

      const stripeReady = await waitForStripeReady();
      const { stripe, elements } = stripeCtxRef.current;
      if (!stripeReady || !stripe || !elements) {
        setIsPreparingPayment(false);
        toast.error("Payment form is still loading, please try again in a moment");
        return;
      }

      setIsPreparingPayment(false);

      const billingCountryObj = findCountryById(billing.country_id);
      const billingZoneObj = findZoneById(billingZones, billing.zone_id);

      const confirmResult = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/account/order/info?order_id=${workingOrderId}&success=1`,
          payment_method_data: {
            billing_details: {
              name: `${billing.firstname} ${billing.lastname}`.trim(),
              email: billing.email,
              phone: billing.telephone,
              address: {
                line1: billing.address_1,
                line2: billing.address_2 || undefined,
                city: billing.city,
                postal_code: billing.postcode,
                state: billingZoneObj?.name || undefined,
                country: billingCountryObj?.iso_code_2 || billingCountryObj?.name || undefined,
              },
            },
          },
        },
        redirect: "if_required",
      });

      if (confirmResult.error) {
        toast.error(
          confirmResult.error?.message || "Payment failed. Please try again."
        );
        return;
      }

      const pi = confirmResult.paymentIntent;
      if (!pi) {
        throw new Error("No payment confirmation received");
      }

      if (pi.status === "succeeded" || pi.status === "processing" || pi.status === "requires_capture") {
        const updatePayload = buildOrderPayload({
          stripe_payment_intent_id: pi.id,
          stripe_client_secret: pi.client_secret,
        });

        try {
          await placeOrderMut.mutateAsync(updatePayload);
        } catch (e) {
          console.warn("Order update after payment succeeded, but order will be finalized via webhook:", e?.message || e);
        }

        await finalizeOrderSuccess(workingOrderId);
      } else if (pi.status === "requires_action") {
        setIsPreparingPayment(false);
        toast.info("Additional verification is required. You will be redirected...");
      } else {
        setIsPreparingPayment(false);
        toast.info(`Payment status: ${pi.status}. We will email you the confirmation.`);
        if (workingOrderId) {
          setTimeout(async () => await finalizeOrderSuccess(workingOrderId), 1500);
        }
      }
    } catch (err) {
      setIsPreparingPayment(false);
      toast.error(err?.message || "Checkout failed, please try again");
    }
  };

  const isProcessing =
    placeOrderMut.isPending || createPIMut.isPending || isPreparingPayment;
  const showStripe =
    paymentCode !== "cod" && STRIPE_PUBLISHABLE_KEY && stripePromise;

  const stripeOptions = clientSecret
    ? {
      clientSecret,
      appearance: {
        theme: "stripe",
        variables: {
          colorPrimary: ACCENT,
          borderRadius: "3px",
        },
      },
    }
    : null;

  const renderCountryOptionValue = (c) =>
    c.country_id != null ? c.country_id : c.contery_id;

  return (
    <main className="font-hind-madurai text-[#333333] mb-10">
      <div className="flex flex-col w-full">
        <ProductsHeader categoryName="Checkout" breadcrumbs={breadcrumbs} />

        {missingOrderId && (
          <div
            className="mx-3 2xl:mx-20 mt-6 p-4 rounded-[4px] flex flex-wrap items-start gap-3 border"
            style={{
              backgroundColor: "#fff7ed",
              borderColor: "#fdba74",
            }}
          >
            <div className="flex-1 min-w-[260px]">
              <p className="font-semibold text-[14px] text-[#9a3412]">
                We noticed a pending order (#{missingOrderId}) from your last session.
              </p>
              <p className="text-[12px] text-[#7c2d12] mt-1">
                The order was created but the payment may not have completed. Continuing checkout will resume this existing order instead of creating a new one.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm("Discard pending order #" + missingOrderId + " and start a fresh checkout?")) {
                  clearMissingOrder();
                  setClientSecret(null);
                }
              }}
              className="text-[12px] font-bold uppercase px-3 py-2 rounded-[3px] text-[#9a3412] hover:bg-[#fed7aa] transition-colors shrink-0"
            >
              Discard &amp; Start Fresh
            </button>
          </div>
        )}

        <div className="bg-[#f7f7f7] pb-10 w-full pt-8">
          <div className="max-w-[1400px] mx-auto px-3 2xl:px-20">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* LEFT COLUMN */}
              <div className="lg:w-[45%] space-y-6">

                {!isLoggedIn && (
                  <div className="bg-[#eeeeee] rounded-[6px] p-5 sm:p-6 md:p-8">
                    {/* Header */}
                    <div className="mb-6">
                      <h2 className="font-sarabun text-[18px] font-bold text-[#333333]">
                        Checkout Options
                      </h2>

                      <div
                        className="h-[2px] w-14 mt-2"
                        style={{ backgroundColor: ACCENT }}
                      />
                    </div>

                    {/* Checkout Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Login */}
                      <label
                        className={`flex items-center p-2 gap-3 rounded-[5px] border  cursor-pointer transition-all ${checkoutType === "login"
                          ? "border-[#999999] bg-white shadow-sm"
                          : "border-transparent bg-[#e5e5e5] hover:bg-white"
                          }`}
                      >
                        <input
                          type="radio"
                          name="checkoutType"
                          value="login"
                          checked={checkoutType === "login"}
                          onChange={(e) => setCheckoutType(e.target.value)}
                          className="w-4 h-4 cursor-pointer shrink-0"
                          style={{ accentColor: ACCENT }}
                        />

                        <div>
                          <p className="font-sarabun font-bold text-[14px] text-[#333333]">
                            Login
                          </p>

                        </div>
                      </label>

                      {/* Register */}
                      <label
                        className={`flex items-center gap-3 rounded-[5px] border p-2 cursor-pointer transition-all ${checkoutType === "register"
                          ? "border-[#999999] bg-white shadow-sm"
                          : "border-transparent bg-[#e5e5e5] hover:bg-white"
                          }`}
                      >
                        <input
                          type="radio"
                          name="checkoutType"
                          value="register"
                          checked={checkoutType === "register"}
                          onChange={(e) => setCheckoutType(e.target.value)}
                          className="w-4 h-4 cursor-pointer shrink-0"
                          style={{ accentColor: ACCENT }}
                        />

                        <div>
                          <p className="font-sarabun whitespace-nowrap font-bold text-[14px] text-[#333333]">
                            Register Account
                          </p>

                        </div>
                      </label>

                      {/* Guest Checkout */}
                      <label
                        className={`flex items-center gap-3 rounded-[5px] border p-2 cursor-pointer transition-all ${checkoutType === "guest"
                          ? "border-[#999999] bg-white shadow-sm"
                          : "border-transparent bg-[#e5e5e5] hover:bg-white"
                          }`}
                      >
                        <input
                          type="radio"
                          name="checkoutType"
                          value="guest"
                          checked={checkoutType === "guest"}
                          onChange={(e) => setCheckoutType(e.target.value)}
                          className="w-4 h-4 cursor-pointer shrink-0"
                          style={{ accentColor: ACCENT }}
                        />

                        <div>
                          <p className="font-sarabun whitespace-nowrap font-bold text-[14px] text-[#333333]">
                            Guest Checkout
                          </p>

                        </div>
                      </label>


                    </div>

                    {/* Login Form */}
                    {checkoutType === "login" && (
                      <div className="mt-6 bg-white rounded-[5px] p-5 sm:p-6 border border-[#dddddd]">
                        <h3 className="font-sarabun text-[16px] font-bold text-[#333333] mb-4">
                          Login to Your Account
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Email */}
                          <div>
                            <label
                              htmlFor="checkout-email"
                              className="block text-[13px] font-semibold text-[#444444] mb-2"
                            >
                              Email Address
                              <span className="text-red-500 ml-1">*</span>
                            </label>

                            <input
                              id="checkout-email"
                              type="email"
                              name="email"
                              placeholder="Enter your email address"
                              className="w-full h-[44px] px-3 rounded-[4px] border border-[#cccccc] bg-white text-[14px] text-[#333333] outline-none transition-all focus:border-[#999999] focus:ring-1 focus:ring-[#dddddd]"
                            />
                          </div>

                          {/* Password */}
                          <div>
                            <label
                              htmlFor="checkout-password"
                              className="block text-[13px] font-semibold text-[#444444] mb-2"
                            >
                              Password
                              <span className="text-red-500 ml-1">*</span>
                            </label>

                            <input
                              id="checkout-password"
                              type="password"
                              name="password"
                              placeholder="Enter your password"
                              className="w-full h-[44px] px-3 rounded-[4px] border border-[#cccccc] bg-white text-[14px] text-[#333333] outline-none transition-all focus:border-[#999999] focus:ring-1 focus:ring-[#dddddd]"
                            />
                          </div>
                        </div>

                        {/* Login Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">
                          <button
                            type="button"
                            className="w-full sm:w-auto px-7 h-[42px] rounded-[4px] text-white text-[13px] font-bold uppercase transition-opacity hover:opacity-90"
                            style={{ backgroundColor: ACCENT }}
                          >
                            Login
                          </button>

                          <button
                            type="button"
                            className="text-[13px] text-[#555555] underline hover:text-[#222222]"
                          >
                            Forgot Password?
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* REGISTER FORM */}
                {!isLoggedIn && checkoutType === "register" && (
                  <div className="bg-[#eeeeee] rounded-[4px] p-6 md:p-8">
                    <h2
                      className={`font-sarabun text-[17px] font-bold text-[#333333] pb-2 mb-1`}
                    >
                      Your Personal Details
                    </h2>
                    <div
                      className="h-[2px] w-14 mb-6"
                      style={{ backgroundColor: ACCENT }}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>
                          First Name {requiredStar}
                        </label>
                        <input
                          type="text"
                          name="firstname"
                          placeholder="First Name"
                          value={registerData.firstname}
                          onChange={handleRegisterChange}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Last Name {requiredStar}
                        </label>
                        <input
                          type="text"
                          name="lastname"
                          placeholder="Last Name"
                          value={registerData.lastname}
                          onChange={handleRegisterChange}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Email {requiredStar}
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Telephone {requiredStar}
                        </label>
                        <input
                          type="tel"
                          name="telephone"
                          placeholder="Telephone"
                          value={registerData.telephone}
                          onChange={handleRegisterChange}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Password {requiredStar}
                        </label>
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Password Confirm {requiredStar}
                        </label>
                        <input
                          type="password"
                          name="confirm"
                          placeholder="Password Confirm"
                          value={registerData.confirm}
                          onChange={handleRegisterChange}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* BILLING ADDRESS */}
                <div className="bg-[#eeeeee] rounded-[4px] p-6 md:p-8">
                  <h2
                    className={`font-sarabun text-[17px] font-bold text-[#333333] pb-2 mb-1`}
                  >
                    Billing Address
                  </h2>
                  <div
                    className="h-[2px] w-14 mb-6"
                    style={{ backgroundColor: ACCENT }}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>
                        First Name {requiredStar}
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={billing.firstname}
                        onChange={handleBillingChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name</label>
                      <input
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        value={billing.lastname}
                        onChange={handleBillingChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Email {requiredStar}
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={billing.email}
                        onChange={handleBillingChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Telephone {requiredStar}
                      </label>
                      <input
                        type="tel"
                        name="telephone"
                        placeholder="Telephone"
                        value={billing.telephone}
                        onChange={handleBillingChange}
                        className={inputClass}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Company</label>
                      <input
                        type="text"
                        name="company"
                        placeholder="Company"
                        value={billing.company}
                        onChange={handleBillingChange}
                        className={inputClass}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>
                        Address 1 {requiredStar}
                      </label>
                      <input
                        type="text"
                        name="address_1"
                        placeholder="Address 1"
                        value={billing.address_1}
                        onChange={handleBillingChange}
                        className={inputClass}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Address 2</label>
                      <input
                        type="text"
                        name="address_2"
                        placeholder="Address 2"
                        value={billing.address_2}
                        onChange={handleBillingChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        City {requiredStar}
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={billing.city}
                        onChange={handleBillingChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Post Code {requiredStar}
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        placeholder="Post Code"
                        value={billing.postcode}
                        onChange={handleBillingChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Country {requiredStar}
                      </label>
                      <select
                        name="country_id"
                        value={billing.country_id}
                        onChange={handleBillingCountryChange}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="">--- Please Select ---</option>
                        {countryData?.map((c) => (
                          <option
                            key={renderCountryOptionValue(c)}
                            value={renderCountryOptionValue(c)}
                          >
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>
                        Region / State {requiredStar}
                      </label>
                      <select
                        name="zone_id"
                        value={billing.zone_id}
                        onChange={handleBillingChange}
                        className={`${inputClass} cursor-pointer`}
                        disabled={!billing.country_id}
                      >
                        <option value="">--- Please Select ---</option>
                        {(billingZones || []).map((z) => (
                          <option key={z.zone_id} value={z.zone_id}>
                            {z.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* SHIPPING ADDRESS */}
                <div className="bg-[#eeeeee] rounded-[4px] p-6 md:p-8">
                  <div className="flex flex-wrap items-center justify-between mb-2 gap-3">
                    <h2
                      className={`font-sarabun text-[17px] font-bold text-[#333333] pb-2 mb-1`}
                    >
                      Where would you like to send this gift?
                    </h2>
                  </div>
                  <div
                    className="h-[2px] w-14 mb-4"
                    style={{ backgroundColor: ACCENT }}
                  />
                  <label className="flex items-center gap-2 mb-5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shippingSameAsBilling}
                      onChange={(e) =>
                        toggleShippingSameAsBilling(e.target.checked)
                      }
                      className="cursor-pointer"
                      style={{ accentColor: ACCENT }}
                    />
                    <span className="text-[13px] font-medium">
                      My billing and shipping address are the same
                    </span>
                  </label>
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${shippingSameAsBilling ? "opacity-40 pointer-events-none" : ""
                      }`}
                  >
                    <div>
                      <label className={labelClass}>
                        First Name {requiredStar}
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={
                          shippingSameAsBilling
                            ? billing.firstname
                            : shipping.firstname
                        }
                        onChange={handleShippingChange}
                        className={inputClass}
                        disabled={shippingSameAsBilling}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name</label>
                      <input
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        value={
                          shippingSameAsBilling
                            ? billing.lastname
                            : shipping.lastname
                        }
                        onChange={handleShippingChange}
                        className={inputClass}
                        disabled={shippingSameAsBilling}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Company</label>
                      <input
                        type="text"
                        name="company"
                        placeholder="Company"
                        value={
                          shippingSameAsBilling
                            ? billing.company
                            : shipping.company
                        }
                        onChange={handleShippingChange}
                        className={inputClass}
                        disabled={shippingSameAsBilling}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>
                        Address 1 {requiredStar}
                      </label>
                      <input
                        type="text"
                        name="address_1"
                        placeholder="Address 1"
                        value={
                          shippingSameAsBilling
                            ? billing.address_1
                            : shipping.address_1
                        }
                        onChange={handleShippingChange}
                        className={inputClass}
                        disabled={shippingSameAsBilling}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Address 2</label>
                      <input
                        type="text"
                        name="address_2"
                        placeholder="Address 2"
                        value={
                          shippingSameAsBilling
                            ? billing.address_2
                            : shipping.address_2
                        }
                        onChange={handleShippingChange}
                        className={inputClass}
                        disabled={shippingSameAsBilling}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        City {requiredStar}
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={
                          shippingSameAsBilling
                            ? billing.city
                            : shipping.city
                        }
                        onChange={handleShippingChange}
                        className={inputClass}
                        disabled={shippingSameAsBilling}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Post Code {requiredStar}
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        placeholder="Post Code"
                        value={
                          shippingSameAsBilling
                            ? billing.postcode
                            : shipping.postcode
                        }
                        onChange={handleShippingChange}
                        className={inputClass}
                        disabled={shippingSameAsBilling}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Country {requiredStar}
                      </label>
                      <select
                        name="country_id"
                        value={
                          shippingSameAsBilling
                            ? billing.country_id
                            : shipping.country_id
                        }
                        onChange={handleShippingCountryChange}
                        className={`${inputClass} cursor-pointer`}
                        disabled={shippingSameAsBilling}
                      >
                        <option value="">--- Please Select ---</option>
                        {countryData.map((c) => (
                          <option
                            key={renderCountryOptionValue(c)}
                            value={renderCountryOptionValue(c)}
                          >
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>
                        Region / State {requiredStar}
                      </label>
                      <select
                        name="zone_id"
                        value={
                          shippingSameAsBilling
                            ? billing.zone_id
                            : shipping.zone_id
                        }
                        onChange={handleShippingChange}
                        className={`${inputClass} cursor-pointer`}
                        disabled={
                          shippingSameAsBilling ||
                          !(shippingSameAsBilling
                            ? billing.country_id
                            : shipping.country_id)
                        }
                      >
                        <option value="">--- Please Select ---</option>
                        {(shippingZones || []).map((z) => (
                          <option key={z.zone_id} value={z.zone_id}>
                            {z.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>
                        Recipients Mobile No.
                      </label>
                      <input
                        type="tel"
                        name="telephone"
                        placeholder="Recipients Mobile No."
                        value={
                          shippingSameAsBilling
                            ? billing.telephone
                            : shipping.telephone
                        }
                        onChange={handleShippingChange}
                        className={inputClass}
                        disabled={shippingSameAsBilling}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col gap-6 flex-1">
                {/* SHIPPING METHOD */}
                <div className="bg-[#eeeeee] rounded-[4px] p-6">
                  <SectionHeader title="Shipping Method" />
                  <div className="space-y-4">
                    {!effectiveCountryId || !effectiveZoneId ? (
                      <div className="text-[13px] text-[#666] bg-white rounded-[3px] p-4 border border-dashed border-gray-300">
                        <p className="flex items-center gap-2">
                          <Truck size={16} className="text-gray-400" />
                          Please select a Country and Region / State in your address to see available shipping rates.
                        </p>
                      </div>
                    ) : shippingRateLoading ? (
                      <div className="flex items-center gap-2 text-[13px] text-[#555] bg-white rounded-[3px] p-4 border border-gray-200">
                        <Loader2 size={16} className="animate-spin" />
                        Fetching shipping rates for your location...
                      </div>
                    ) : (
                      <>
                        {SHIPPING_METHODS.map((rate) => (
                          <label
                            key={rate.id}
                            className="flex items-start gap-3 text-[14px] cursor-pointer p-3 rounded border border-transparent hover:border-gray-200 transition-colors"
                            style={{
                              borderColor:
                                shippingMethodId === rate.id
                                  ? "rgba(140,26,60,0.35)"
                                  : undefined,
                              background:
                                shippingMethodId === rate.id ? "#f9f9f9" : undefined,
                            }}
                          >
                            <Truck size={20} className="text-[#333] shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="shippingMethod"
                                  checked={shippingMethodId === rate.id}
                                  onChange={() => setShippingMethodId(rate.id)}
                                  className="cursor-pointer"
                                  style={{ accentColor: ACCENT }}
                                />
                                <span className="font-medium">{rate.label}</span>
                              </div>
                            </div>
                            <div className="font-bold">
                              ${rate.cost.toFixed(2)}
                            </div>
                          </label>
                        ))}
                        {!shippingRate?.allMatches || shippingRate.allMatches.length === 0 ? (
                          <div className="text-[12px] text-[#888] bg-white rounded-[3px] p-3 border border-gray-200">
                            Showing default shipping rates. Select a valid address to see location-specific options.
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>

                {/* COUPON / GIFT CERT */}
                <div className="bg-[#eeeeee] rounded-[4px] p-6 space-y-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <label className="text-[14px] font-medium w-56 shrink-0">
                      Enter your coupon here
                    </label>
                    <div className="flex-1 flex w-full">
                      <input
                        type="text"
                        placeholder="Enter your coupon here"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="flex-1 border border-gray-200 py-2 px-3 text-[13px] focus:outline-none bg-white"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-black text-white px-6 py-2 text-[12px] font-bold uppercase hover:bg-[#98022e] transition-colors cursor-pointer"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <label className="text-[14px] font-medium w-56 shrink-0">
                      Enter your gift certificate code here
                    </label>
                    <div className="flex-1 flex w-full">
                      <input
                        type="text"
                        placeholder="Enter your gift certificate code here"
                        value={giftCert}
                        onChange={(e) => setGiftCert(e.target.value)}
                        className="flex-1 border border-gray-200 py-2 px-3 text-[13px] focus:outline-none bg-white"
                      />
                      <button
                        onClick={handleApplyGiftCert}
                        className="bg-black text-white px-6 py-2 text-[12px] font-bold uppercase hover:bg-[#98022e] transition-colors cursor-pointer"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>

                {/* SUPPORT TEAM */}
                <div className="bg-[#eeeeee] rounded-[4px] p-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-[14px] font-bold text-[#333]">
                      Show your support for the team at DC Wine &amp; Spirits
                    </span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-[14px]">
                        <input
                          type="radio"
                          checked={supportTeam === "yes"}
                          onChange={() => setSupportTeam("yes")}
                          className="cursor-pointer"
                          style={{ accentColor: ACCENT }}
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[14px]">
                        <input
                          type="radio"
                          checked={supportTeam === "no"}
                          onChange={() => setSupportTeam("no")}
                          className="cursor-pointer"
                          style={{ accentColor: ACCENT }}
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {/* CART DETAILS */}
                <div>
                  <h2
                    className={`font-sarabun text-[20px] font-bold text-[#333333] pb-2 mb-4 border-b border-[#98022e] inline-block`}
                  >
                    Cart Details
                  </h2>
                  {cartLoading ? (
                    <div className="py-10 text-center text-[14px] text-gray-600 font-medium flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Loading cart
                      items...
                    </div>
                  ) : cartItems.length === 0 ? (
                    <div className="py-10 text-center text-[14px] text-gray-600 font-medium">
                      Your cart is empty.
                      <div className="mt-4">
                        <Link
                          href="/"
                          className="inline-block px-6 py-2 text-[12px] font-bold uppercase text-white bg-black hover:bg-[#98022e] transition-colors"
                        >
                          Start Shopping
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto mt-2">
                        <table className="w-full text-[13px] border-collapse">
                          <thead>
                            <tr className="text-left text-[11px] font-bold uppercase text-[#333]">
                              <th className="p-3">Image</th>
                              <th className="p-3">Product Name</th>
                              <th className="p-3 text-center">Model</th>
                              <th className="p-3 text-center">Qty</th>
                              <th className="p-3 text-right">Unit Price</th>
                              <th className="p-3 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cartItems.map((item) => (
                              <tr
                                key={item.cart_id}
                                className="border-t border-gray-200"
                              >
                                <td className="p-3 w-20">
                                  <Link href={`/${item.slug}`}>
                                    <div className="w-14 h-16 relative">
                                      <Image
                                        fill
                                        loading="lazy"
                                        src={item.image}
                                        alt={item.name}
                                        className="object-contain"
                                        onError={(e) => {
                                          e.currentTarget.src =
                                            "/placeholder-product.png";
                                        }}
                                      />
                                    </div>
                                  </Link>
                                </td>
                                <td className="p-3">
                                  <Link href={`/${item.slug}`}>
                                    <p
                                      className="font-medium"
                                      style={{ color: ACCENT }}
                                    >
                                      {item.name}
                                    </p>
                                  </Link>
                                  {item.selected_options?.length > 0 && (
                                    <ul className="mt-1 text-[11px] text-gray-500 space-y-0.5">
                                      {item.selected_options.map((o, i) => (
                                        <li key={i}>
                                          <span className="font-medium">
                                            {o.option_name}:
                                          </span>{" "}
                                          {String(o.value)}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </td>
                                <td className="p-3 text-center text-[#444444]">
                                  {item.model}
                                </td>
                                <td className="p-3 text-center font-medium">
                                  {item.quantity}
                                </td>
                                <td className="p-3 text-right">
                                  ${item.unitPrice.toFixed(2)}
                                </td>
                                <td className="p-3 text-right font-semibold">
                                  ${item.total.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 flex flex-col items-end w-full space-y-0 text-[14px]">
                        <div className="w-full flex justify-end gap-5 bg-[#f9f9f9] p-2 border border-gray-200 border-b-0">
                          <span className="font-bold">Sub-Total:</span>
                          <span>${subTotal.toFixed(2)}</span>
                        </div>
                        <div className="w-full flex justify-end gap-5 bg-[#f9f9f9] p-2 border border-gray-200 border-b-0">
                          <span className="font-bold">
                            {selectedShipping?.name || "Shipping"}:
                          </span>
                          <span>${shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="w-full flex justify-end gap-5 bg-[#f9f9f9] p-2 border border-gray-200 font-bold text-base text-black">
                          <span>Total:</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* PAYMENT DETAILS */}
                <div className="bg-[#eeeeee] rounded-[4px] p-6">
                  <h2
                    className={`font-sarabun text-[17px] font-bold text-[#333333] pb-2 mb-1`}
                  >
                    Payment Details
                  </h2>
                  <div
                    className="h-[2px] w-14 mb-6"
                    style={{ backgroundColor: ACCENT }}
                  />

                  <div className="space-y-3 mb-6">
                    {PAYMENT_METHODS.map((pm) => (
                      <label
                        key={pm.code}
                        className="flex items-center gap-3 p-3 rounded border border-transparent cursor-pointer hover:border-gray-200 transition-colors"
                        style={{
                          borderColor:
                            paymentCode === pm.code
                              ? "rgba(140,26,60,0.35)"
                              : undefined,
                          background:
                            paymentCode === pm.code ? "#f9f9f9" : undefined,
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentCode === pm.code}
                          onChange={() => {
                            setPaymentCode(pm.code);
                            if (pm.code === "cod") setClientSecret(null);
                          }}
                          className="cursor-pointer"
                          style={{ accentColor: ACCENT }}
                        />
                        <span className="text-[14px] font-medium">
                          {pm.method}
                        </span>
                        {pm.code !== "cod" && (
                          <CreditCard
                            size={16}
                            className="text-gray-400 ml-auto"
                          />
                        )}
                      </label>
                    ))}
                  </div>

                  {showStripe && (
                    <div className="mb-2">
                      {stripeOptions ? (
                        <Elements stripe={stripePromise} options={stripeOptions}>
                          <StripePaymentForm
                            onSubmitReady={setStripeSubmitRef}
                            isProcessing={isProcessing}
                          />
                        </Elements>
                      ) : (
                        <button
                          type="button"
                          onClick={async () => {
                            if (!validateBilling()) return;
                            if (!validateShipping()) return;
                            if (!validateRegister()) return;
                            if (cartItems.length === 0) {
                              toast.error("Your cart is empty");
                              return;
                            }
                            setIsPreparingPayment(true);
                            try {
                              const createOrderPayload = buildOrderPayload();
                              const orderResult = await placeOrderMut.mutateAsync(createOrderPayload);

                              if (!orderResult?.success || !orderResult?.data?.order_id) {
                                throw new Error(orderResult?.message || "Failed to initialize order");
                              }

                              const ordId = orderResult?.data?.order_id;
                              let secret = orderResult?.data?.stripe_client_secret;
                              let piId = orderResult?.data?.stripe_payment_intent_id || null;

                              if (!secret) {
                                const piResult = await createPIMut.mutateAsync({
                                  amount: total,
                                  currency: "usd",
                                  customer_email: billing?.email,
                                  customer_name: `${billing?.firstname} ${billing?.lastname}`.trim(),
                                });
                                if (!piResult?.success || !piResult.clientSecret) {
                                  throw new Error(piResult?.message || "Failed to initialize payment form");
                                }
                                secret = piResult?.clientSecret;
                                piId = piResult?.paymentIntentId || null;
                              }

                              saveMissingOrder(ordId, piId, secret);
                              setClientSecret(secret);
                            } catch (err) {
                              toast.error(err?.message || "Failed to initialize payment form");
                            } finally {
                              setIsPreparingPayment(false);
                            }
                          }}
                          disabled={isPreparingPayment || cartItems.length === 0}
                          className="w-full border border-dashed border-gray-300 bg-white rounded-[3px] py-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                        >
                          {isPreparingPayment ? (
                            <>
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />{" "}
                              Preparing payment form...
                            </>
                          ) : (
                            <>
                              <CreditCard size={15} /> Click here to enter card
                              details
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {/* {paymentCode === "cod" && (
                    <div
                      className="p-4 rounded-[3px] text-[13px]"
                      style={{ background: "#fff4e6" }}
                    >
                      <p className="font-semibold mb-1">Cash on Delivery</p>
                      <p className="text-gray-700">
                        Pay in cash when your order is delivered. (Available
                        only in select areas.)
                      </p>
                    </div>
                  )} */}
                </div>

                {/* ORDER NOTE + CHECKOUT BUTTON */}
                <div className="bg-[#eeeeee] rounded-[4px] p-6">
                  <h2
                    className={`font-sarabun text-[17px] font-bold text-[#333333] pb-2 mb-1`}
                  >
                    Message / Gift Note / Order Instructions
                  </h2>
                  <div
                    className="h-[2px] w-14 mb-6"
                    style={{ backgroundColor: ACCENT }}
                  />

                  <textarea
                    placeholder="Add a gift note, delivery instructions or any special request for your order..."
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    rows={5}
                    className="w-full border border-gray-200 rounded-[3px] py-2.5 px-3 text-[13px] resize-y focus:outline-none focus:ring-1 focus:ring-[#8c1a3c] bg-white"
                  />

                  <div className="mt-5 space-y-3">
                    <label className="flex items-center gap-2 text-[14px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreePrivacy}
                        onChange={(e) => setAgreePrivacy(e.target.checked)}
                        className="cursor-pointer"
                        style={{ accentColor: ACCENT }}
                      />
                      <span>
                        I have read and agree to the{" "}
                        <button
                          type="button"
                          onClick={() => setIsPrivacyModalOpen(true)}
                          className="underline font-medium hover:opacity-80 transition-opacity cursor-pointer"
                          style={{ color: ACCENT }}
                        >
                          Privacy Policy
                        </button>
                      </span>
                    </label>
                    <label className="flex items-center gap-2 text-[14px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="cursor-pointer"
                        style={{ accentColor: ACCENT }}
                      />
                      <span>
                        I have read and agree to the{" "}
                        <button
                          type="button"
                          onClick={() => setIsTermsModalOpen(true)}
                          className="underline font-medium hover:opacity-80 transition-opacity cursor-pointer"
                          style={{ color: ACCENT }}
                        >
                          Terms &amp; Conditions
                        </button>
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || cartItems.length === 0}
                    className="w-full bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 mt-6 transition-all duration-300 hover:bg-[#98022e] hover:rounded-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:rounded-none flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        Confirm Order
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-gray-500 mt-3 text-center flex items-center justify-center gap-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Secure &amp; encrypted checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={isPrivacyModalOpen}
        onOpenChange={setIsPrivacyModalOpen}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </Modal>
      <Modal
        open={isTermsModalOpen}
        onOpenChange={setIsTermsModalOpen}
        title="Terms &amp; Conditions"
      >
        <TermsAndConditions />
      </Modal>
    </main>
  );
};

export default CheckoutClient;
