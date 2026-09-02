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
  Lock,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import Modal from "@/app/components/ui/Modal";
import PrivacyPolicyContent from "@/app/components/ui/PrivacyPolicyContent";
import TermsAndConditions from "@/app/components/ui/TermsAndConditions";
import { useCountryget } from "../api/hooks/customerAddress/useCountryget";
import { useZoneget } from "../api/hooks/customerAddress/useZoneget";
import { useGetAddresses } from "../api/hooks/customerAddress/useGetAddresses";
import { useGetCartList } from "../api/hooks/cart/useGetCartList";
import { useClearCart } from "../api/hooks/cart/useClearCart";
import { useUser } from "../api/hooks/useAuth";
import { usePlaceOrder } from "../api/hooks/checkout/usePlaceOrder";
import { useCreatePaymentIntent } from "../api/hooks/checkout/useCreatePaymentIntent";
import { useshippingRate } from "../api/hooks/useShippingRate";
import { useCheckoutLogin } from "../api/hooks/checkout/useCheckoutLogin";
import { useFormik } from "formik";
import { useCoupon } from "../api/hooks/coupon/useCoupon";
import { useupdatedCart } from "../api/hooks/cart/useUpdatedCart";
import { decodeHtml } from "@/libs/decodeHtml";

const ACCENT = "#8c1a3c";
const STRIPE_PUBLISHABLE_KEY = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const breadcrumbs = [
  { label: "Shopping Cart", href: "/cart/" },
  { label: "Checkout", href: "/checkout/" },
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
    price: 20.0,
  },
  {
    id: "same_day",
    code: "flat.same_day",
    name: "Same Day Delivery",
    label:
      "Same Day Delivery (Only in DC and Northern VA, order must be before 2:00PM)",
    price: 100.0,
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

// Fields that must be filled + valid before the shipping section unlocks
const BILLING_REQUIRED_FIELDS = [
  "firstname",
  "address_1",
  "city",
  "postcode",
  "country_id",
  "zone_id",
];
const SHIPPING_REQUIRED_FIELDS = [
  "firstname",
  "address_1",
  "city",
  "postcode",
  "country_id",
  "zone_id",
];

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));

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

const CheckoutClient = () => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const { data: countryData = [] } = useCountryget();
  const { data: user, isLoading: userLoading } = useUser();
  const { data: cartRaw, isLoading: cartLoading } = useGetCartList();
  const { mutate: loginId, mutateAsync: loginasync, isPending } = useCheckoutLogin();


  const isLoggedIn = !!user?.customer_id;
  

  const { data: addresses = [], refetch: refetchAddresses } = useGetAddresses(isLoggedIn);
   
  const getZones = useZoneget();
  const { mutateAsync: placeOrderMut } = usePlaceOrder();
  const createPIMut = useCreatePaymentIntent();
  const { mutate: clearCartMut } = useClearCart();
  const { data: couponData, mutate } = useCoupon();
  const { mutate: updateCart } = useupdatedCart();
  const [checkoutType, setCheckoutType] = useState("guest");
  const [registerData, setRegisterData] = useState(EMPTY_REGISTER);
  const [billing, setBilling] = useState(EMPTY_BILLING);
  const [billingZones, setBillingZones] = useState([]);
  const [billingAddressMode, setBillingAddressMode] = useState("existing");
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState("");
  const [shippingSameAsBilling, setShippingSameAsBilling] = useState(false);
  const [shipping, setShipping] = useState(EMPTY_SHIPPING);
  const [shippingZones, setShippingZones] = useState([]);
  const [shippingAddressMode, setShippingAddressMode] = useState("existing");
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState("");
  const [shippingMethod, setShippingMethod] = useState(null);
  const [paymentCode, setPaymentCode] = useState("stripe");
  const [coupon, setCoupon] = useState("");
  const [giftCert, setGiftCert] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  // ── Draft-order tracking (silent auto-save), same idea as the first checkout ──
  const [missingOrderId, setMissingOrderId] = useState(null);
  const [draftIntentId, setDraftIntentId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  const autoUpdateTimerRef = useRef(null);
  const isCouponActive = useRef(false);
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)

  // ── Tips ──
  const [supportTeam, setSupportTeam] = useState("no");
  const [selectedTip, setSelectedTip] = useState("");
  const [customTipValue, setCustomTipValue] = useState("");

  // --- discount ---------------
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  // ── Load any pending draft order from a previous session ──
  useEffect(() => {
    setMissingOrderId(sessionStorage.getItem("missing_order_id"));
    setDraftIntentId(sessionStorage.getItem("stripe_payment_intent_id"));
    setClientSecret(sessionStorage.getItem("stripe_client_secret"));
  }, []);
  const isUSAddress = (countryId) => String(countryId) === "223";
  const clearMissingOrder = () => {
    setMissingOrderId(null);
    setDraftIntentId(null);
    setClientSecret(null);
    sessionStorage.removeItem("missing_order_id");
    sessionStorage.removeItem("stripe_payment_intent_id");
    sessionStorage.removeItem("stripe_client_secret");
  };

  useEffect(() => {
    const loadDefaultZones = async () => {
      try {
        const bZones = await getZones.mutateAsync(EMPTY_BILLING.country_id);
        const billingZoneList = bZones || [];
        setBillingZones(billingZoneList);
        if (!billing.zone_id && billingZoneList.length > 0) {
          const defaultBillingZone = billingZoneList?.[0]?.zone_id;
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

  }, []);

  useEffect(() => {
    if (isLoggedIn && !userLoading) {
      const u = user;
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

  const formatAddressLabel = (addr) => {
    if (!addr) return "";
    const parts = [];
    if (addr.firstname) parts.push(addr.firstname);
    if (addr.lastname) parts.push(addr.lastname);
    if (addr.address_1) parts.push(addr.address_1);
    if (addr.address_2) parts.push(addr.address_2);
    if (addr.city) parts.push(addr.city);
    if (addr.zone_name) parts.push(addr.zone_name);
    if (addr.country_name) parts.push(addr.country_name);
     
    return parts.filter(Boolean).join(" ");
  };
  
  // console.log("formatAddressLabel",)
  const populateAddressToBilling = (addr) => {
    if (!addr) return;
    setBilling((prev) => ({
      ...prev,
      firstname: addr.firstname || prev.firstname,
      lastname: addr.lastname || prev.lastname,
      company: addr.company || "",
      address_1: addr.address_1 || "",
      address_2: addr.address_2 || "",
      city: addr.city || "",
      postcode: addr.postcode || "",
      country_id: String(addr.country_id || prev.country_id),
      zone_id: String(addr.zone_id || ""),
    }));
    if (addr.country_id) {
      loadZones(String(addr.country_id), setBillingZones, (firstZoneId) => {
        if (!addr.zone_id) {
          setBilling((prev) => ({ ...prev, zone_id: firstZoneId }));
        }
      });
    }
  }

  const populateAddressToShipping = (addr) => {
    if (!addr) return;

    if (!isUSAddress(addr.country_id)) {
      toast.error("We currently only deliver within the United States. Please select or add a US shipping address.");
      return;
    }
    setShipping((prev) => ({
      ...prev,
      firstname: addr.firstname || prev.firstname,
      lastname: addr.lastname || prev.lastname,
      company: addr.company || "",
      address_1: addr.address_1 || "",
      address_2: addr.address_2 || "",
      city: addr.city || "",
      postcode: addr.postcode || "",
      country_id: String(addr.country_id || prev.country_id),
      zone_id: String(addr.zone_id || ""),
      telephone: prev.telephone || "",
    }));
    if (addr.country_id) {
      loadZones(String(addr.country_id), setShippingZones, (firstZoneId) => {
        if (!addr.zone_id) {
          setShipping((prev) => ({ ...prev, zone_id: firstZoneId }));
        }
      });
    }
  };

  useEffect(() => {
    if (!isLoggedIn || addresses.length === 0) return;
    const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
    if (defaultAddr) {
      setSelectedBillingAddressId(String(defaultAddr.address_id));
      setBillingAddressMode("existing");
      populateAddressToBilling(defaultAddr);


      if (isUSAddress(defaultAddr.country_id)) {
        setSelectedShippingAddressId(String(defaultAddr.address_id));
        setShippingAddressMode("existing");
        populateAddressToShipping(defaultAddr);
      } else {
        toast.error("We only deliver within the US. Please add or select a US shipping address.");
        setSelectedShippingAddressId("");
        setShippingAddressMode("new");
        setShipping((prev) => ({ ...EMPTY_SHIPPING, country_id: "223" }));
      }
    }
  }, [isLoggedIn, addresses]);

  useEffect(() => {
    if (!isLoggedIn || addresses.length === 0) return;
    const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
    if (defaultAddr) {
      setSelectedBillingAddressId(String(defaultAddr.address_id));
      setBillingAddressMode("existing");
      populateAddressToBilling(defaultAddr);


      if (isUSAddress(defaultAddr.country_id)) {
        setSelectedShippingAddressId(String(defaultAddr.address_id));
        setShippingAddressMode("existing");
        populateAddressToShipping(defaultAddr);
      } else {
        toast.error("We only deliver within the US. Please add or select a US shipping address.");
        setSelectedShippingAddressId("");
        setShippingAddressMode("new");
        setShipping((prev) => ({ ...EMPTY_SHIPPING, country_id: "223" }));
      }
    }
  }, [isLoggedIn, addresses]);

  useEffect(() => {
    if (!isLoggedIn || shippingAddressMode !== "existing" || !selectedShippingAddressId || shippingSameAsBilling) return;
    const addr = addresses.find((a) => String(a.address_id) === String(selectedShippingAddressId));
    if (addr) {
      populateAddressToShipping(addr);
    }

  }, [selectedShippingAddressId, shippingAddressMode, shippingSameAsBilling]);

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
        price: Number(match.price || 0),
      }));
    }
    return SHIPPING_METHODS_FALLBACK;
  }, [shippingRate]);
  useEffect(() => {
    if (!SHIPPING_METHODS.length) return;
    const stillValid = SHIPPING_METHODS.some((r) => r.name === shippingMethod);
    if (!stillValid) {
      setShippingMethod(SHIPPING_METHODS[0].name);
    }
  }, [SHIPPING_METHODS]);



  const subTotal = useMemo(
    () => cartItems.reduce((acc, it) => acc + it.total, 0),
    [cartItems]
  );
  const tipAmount = (() => {
    if (supportTeam === "no" || !selectedTip) return 0;
    if (selectedTip === "5%") return parseFloat((subTotal * 0.05).toFixed(2));
    if (selectedTip === "10%") return parseFloat((subTotal * 0.10).toFixed(2));
    if (selectedTip === "15%") return parseFloat((subTotal * 0.15).toFixed(2));
    if (selectedTip === "$5") return 5;
    if (selectedTip === "$10") return 10;
    if (selectedTip === "$15") return 15;
    if (selectedTip === "custom") return parseFloat(customTipValue) || 0;
    return 0;
  })();

  const selectedShipping = SHIPPING_METHODS.find((r) => r.name === shippingMethod);
  const shippingCost = selectedShipping ? selectedShipping?.price * cartTotalQty : 0;
  const taxRate = 0.0625;
  const tax = subTotal * taxRate;


  const discountAmount = coupon.trim().length === 0 ? 0 : appliedDiscount;
  const total = discountAmount ? (subTotal + shippingCost + tipAmount + tax) - discountAmount : subTotal + shippingCost + tipAmount + tax;



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
    if (checked && !isUSAddress(billing.country_id)) {
      toast.error("We only deliver within the United States. Please enter a separate US shipping address.");
      return;
    }
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
    (zones || []).find((z) => String(z.zone_id) === String(id));

  const renderCountryOptionValue = (c) =>
    c.country_id != null ? c.country_id : c.contery_id;

  // ══════════════════════════════════════════════════════════════════════
  // GATING: shipping section only unlocks once billing above is complete
  // ══════════════════════════════════════════════════════════════════════
  const isBillingComplete = useMemo(() => {
    const filled = BILLING_REQUIRED_FIELDS.every(
      (f) => billing[f] && String(billing[f]).trim() !== ""
    );
    const emailOk = billing.email && validateEmail(billing.email);
    const phoneOk = billing.telephone && String(billing.telephone).trim() !== "";
    return filled && emailOk && phoneOk;
  }, [billing]);

  const isShippingComplete = useMemo(() => {
    if (shippingSameAsBilling) return isBillingComplete;
    return SHIPPING_REQUIRED_FIELDS.every(
      (f) => shipping[f] && String(shipping[f]).trim() !== ""
    );
  }, [shipping, shippingSameAsBilling, isBillingComplete]);

  // ══════════════════════════════════════════════════════════════════════
  // SILENT DRAFT ORDER (auto-update) — mirrors the first checkout page:
  // once billing + shipping are both valid, quietly create/update a draft
  // order (and Stripe payment intent) in the background so the PaymentElement
  // / CardElement has a client secret ready before the user hits "Place Order".
  // ══════════════════════════════════════════════════════════════════════
  const buildOrderPayload = useCallback(
    ({ missingOrderId: mOrderId = null, stripeIntentId = null, stripeSecret = null } = {}) => {
      const resolvedShipping = shippingSameAsBilling ? billing : shipping;
      const resolvedShippingZones = shippingSameAsBilling ? billingZones : shippingZones;

      const billingCountry = findCountryById(billing.country_id);
      const billingZone = findZoneById(billingZones, billing.zone_id);
      const shippingCountry = findCountryById(resolvedShipping.country_id);
      const shippingZone = findZoneById(resolvedShippingZones, resolvedShipping.zone_id);

      return {
        missing_order_id:
          mOrderId ?? missingOrderId ?? sessionStorage.getItem("missing_order_id"),
        stripe_payment_intent_id:
          stripeIntentId ?? draftIntentId ?? sessionStorage.getItem("stripe_payment_intent_id"),
        stripe_client_secret:
          stripeSecret ?? clientSecret ?? sessionStorage.getItem("stripe_client_secret"),

        customer: {
          id: user?.customer_id ?? 0,
          firstname: billing.firstname || registerData.firstname,
          lastname: billing.lastname || registerData.lastname,
          email: billing.email || registerData.email,
          telephone: billing.telephone || registerData.telephone,
          ...(checkoutType === "register" && registerData.password
            ? { password: registerData.password }
            : {}),
        },

        payment_firstname: billing.firstname ?? "",
        payment_lastname: billing.lastname ?? "",
        payment_company: billing.company ?? "",
        payment_address_1: billing.address_1 ?? "",
        payment_address_2: billing.address_2 ?? "",
        payment_city: billing.city ?? "",
        payment_postcode: billing.postcode ?? "",
        payment_zone: billingZone?.name ?? "",
        payment_zone_id: Number(billing.zone_id) ?? 0,
        payment_country: billingCountry?.name ?? "",
        payment_country_id: Number(billing.country_id) ?? 0,
        payment_address_format: "",
        payment_custom_field: "",
        payment_method: paymentCode === "cod" ? "Cash On Delivery" : "Credit/Debit Card",
        payment_code: paymentCode,

        shipping_firstname: resolvedShipping.firstname ?? "",
        shipping_lastname: resolvedShipping.lastname ?? "",
        // shipping_telephone: resolvedShipping.telephone ?? "",
        shipping_company: resolvedShipping.company ?? "",
        shipping_address_1: resolvedShipping.address_1 ?? "",
        shipping_address_2: resolvedShipping.address_2 ?? "",
        shipping_city: resolvedShipping.city ?? "",
        shipping_postcode: resolvedShipping.postcode ?? "",
        shipping_zone: shippingZone?.name ?? "",
        shipping_zone_id: Number(resolvedShipping.zone_id) ?? 0,
        shipping_country: shippingCountry?.name ?? "",
        shipping_country_id: Number(resolvedShipping.country_id) ?? 0,
        shipping_address_format: "",
        shipping_custom_field: { "1": resolvedShipping?.telephone },
        shipping_method: selectedShipping?.name || "Standard Shipping",
        shipping_code: selectedShipping?.code || "flat.flat",
        shipping_cost: shippingCost,

        products: cartItems.map((item) => ({
          product_id: item.product_id,
          name: item.name,
          model: item.model,
          quantity: item.quantity,
          price: item.unitPrice,
          total: item.total,
          tax: 0,
          reward: 0,
          options: (item.option || []).filter((v) => v?.value) || [],
        })),

        totals: [
          { code: "sub_total", title: "Sub-Total", value: subTotal, sort_order: 1 },
          { code: "shipping", title: selectedShipping?.name || "Shipping", value: shippingCost, sort_order: 3 },
          ...(tipAmount > 0 ? [{ code: "tip", title: "Tip", value: tipAmount, sort_order: 5 }] : []),
          { code: "tax", title: "Tax", value: tax, sort_order: 6 },
          ...(discountAmount ? [{ code: "coupon", title: `Coupon (${coupon})`, value: -discountAmount, sort_order: 4 }] : []),
          { code: "total", title: "Total", value: total, sort_order: 9 },
        ],

        comment: orderNote,
        checkoutType,
        registerData:
          checkoutType === "register"
            ? {
              email: registerData.email,
              password: registerData.password,
              firstname: registerData.firstname,
              lastname: registerData.lastname,
              telephone: registerData.telephone,
            }
            : null,
        coupon_id: discountAmount > 0 ? couponData?.coupon?.coupon_id : null,
        discountAmount: -discountAmount
      };
    },
    [
      billing, shipping, shippingSameAsBilling, billingZones, shippingZones, countryData,
      registerData, checkoutType, paymentCode, cartItems, subTotal, shippingCost, total,
      selectedShipping, orderNote, missingOrderId, draftIntentId, clientSecret, user,
      tipAmount, tax, discountAmount, coupon, couponData,
    ]
  );

  const triggerAutoUpdate = useCallback(() => {

    if (!isBillingComplete || !isShippingComplete) return;
    if (!cartItems.length) return;

    if (autoUpdateTimerRef.current) clearTimeout(autoUpdateTimerRef.current);

    autoUpdateTimerRef.current = setTimeout(async () => {
      try {
        const payload = buildOrderPayload();
        const result = await placeOrderMut(payload);

        if (result?.data?.order_id) {
          setMissingOrderId(result.data.order_id);
          setDraftIntentId(result.data.stripe_payment_intent_id);
          setClientSecret(result.data.stripe_client_secret);

          sessionStorage.setItem("missing_order_id", result.data.order_id);
          sessionStorage.setItem(
            "stripe_payment_intent_id",
            result.data.stripe_payment_intent_id
          );
          sessionStorage.setItem(
            "stripe_client_secret",
            result.data.stripe_client_secret
          );
        }
      } catch (err) {
        console.error("Auto-update failed:", err?.message);
      }
    }, 800);
  }, [isBillingComplete, isShippingComplete, cartItems.length, buildOrderPayload, placeOrderMut]);

  useEffect(() => {
    triggerAutoUpdate();
  }, [triggerAutoUpdate]);

  useEffect(() => {
    return () => { if (autoUpdateTimerRef.current) clearTimeout(autoUpdateTimerRef.current); };
  }, []);

  // ══════════════════════════════════════════════════════════════════════
  // FINAL "Place Order" — confirms Stripe payment against the draft order
  // ══════════════════════════════════════════════════════════════════════
  const handleConfirmOrder = async () => {
    setOrderError("");

    if (!validateBilling()) return;
    if (!validateShipping()) return;
    if (!validateRegister()) return;

    if (cartItems.length === 0) {
      setOrderError("Your cart is empty.");
      return;
    }
    if (!agreePrivacy || !agreeTerms) {
      setOrderError("Please agree to the Privacy Policy and Terms & Conditions.");
      return;
    }
    if (!stripe || !elements) {
      setOrderError("Payment form is not ready yet. Please wait a moment and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const cardElement = elements.getElement(CardElement);

      const { error: pmError, paymentMethod: pm } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: `${billing.firstname ?? ""} ${billing.lastname ?? ""}`.trim(),
          email: billing.email || registerData.email || undefined,
          phone: billing.telephone || undefined,
          address: {
            line1: billing.address_1 || undefined,
            line2: billing.address_2 || undefined,
            city: billing.city || undefined,
            postal_code: billing.postcode || undefined,
          },
        },
      });

      if (pmError) {
        setOrderError(pmError.message);
        setIsSubmitting(false);
        return;
      }

      const secret = clientSecret || sessionStorage.getItem("stripe_client_secret");
      const intentId = draftIntentId || sessionStorage.getItem("stripe_payment_intent_id");
      const orderId = missingOrderId || sessionStorage.getItem("missing_order_id");

      if (!secret || !intentId) {
        setOrderError("Payment setup is not ready yet. Please wait a moment and try again.");
        setIsSubmitting(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(secret, {
        payment_method: pm.id,
      });

      if (confirmError) {
        setOrderError(confirmError.message);
        setIsSubmitting(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        try {
          await placeOrderMut(
            buildOrderPayload({
              missingOrderId: orderId,
              stripeIntentId: intentId,
              stripeSecret: secret,
            })
          );
        } catch (e) {
          console.warn("Order status update failed:", e?.message);
        }
      }

      let finalCheckoutType = checkoutType;
      if (isLoggedIn) {
        finalCheckoutType = "login";
      } else if (checkoutType === "register") {
        try {
          await loginasync({ email: registerData.email, password: registerData.password });
          finalCheckoutType = "register";
        } catch (e) {
          console.warn("Auto-login after register failed:", e?.message);
          finalCheckoutType = "guest";
        }
      } else if (checkoutType === "login" && email && password) {
        try {
          await loginasync({ email, password });
          finalCheckoutType = "login";
        } catch (e) {
          console.warn("Auto-login before redirect failed:", e?.message);
          finalCheckoutType = "guest";
        }
      }

      clearMissingOrder();
      setCoupon("");
      const redirect =
        finalCheckoutType === "login" || finalCheckoutType === "register"
          ? `/account/order/info/?order_id=${orderId}`
          : orderId
            ? `/account/order/info/?order_id=${orderId}`
            : "/";

      sessionStorage.setItem("checkoutType", finalCheckoutType);
      sessionStorage.setItem("redirectAfterThankYou", redirect);

      cartItems.forEach((item) => clearCartMut(item.cart_id));
      router.replace("/thank-you");
    } catch (err) {
      setOrderError(err?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleApplingCoupon = () => {
    mutate({ code: coupon, cartTotal: subTotal }, {
      onSuccess: (data) => {
        if (!data?.success) {
          toast.error(data?.message);
          setAppliedDiscount(0);
          isCouponActive.current = false;
        } else {
          toast.success(data?.message);
          setAppliedDiscount(Number(data?.discountAmount || 0));
          isCouponActive.current = true;
        }
      },
      onError: () => {
        setAppliedDiscount(0);
        isCouponActive.current = false;
      }
    });
  };

  const handleCouponChange = (e) => {
    const value = e.target.value;
    setCoupon(value);
    if (value.trim().length === 0) {
      setAppliedDiscount(0);
      isCouponActive.current = false;
    }
  };

  useEffect(() => {
    if (!isCouponActive.current || !coupon.trim()) return;

    const timer = setTimeout(() => {
      mutate({ code: coupon, cartTotal: subTotal }, {
        onSuccess: (data) => {
          if (!data?.success) {
            toast.error(data?.message);
            setAppliedDiscount(0);
            isCouponActive.current = false;
          } else {
            setAppliedDiscount(Number(data?.discountAmount || 0));
          }
        },
        onError: () => {
          setAppliedDiscount(0);
          isCouponActive.current = false;
        }
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [subTotal]);


  
  return (
    <main className="font-hind-madurai text-[#333333] mb-10">
      <div className="flex flex-col w-full">
        <ProductsHeader categoryName="Checkout" breadcrumbs={breadcrumbs} />
        {/* 
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
                }
              }}
              className="text-[12px] font-bold uppercase px-3 py-2 rounded-[3px] text-[#9a3412] hover:bg-[#fed7aa] transition-colors shrink-0"
            >
              Discard &amp; Start Fresh
            </button>
          </div>
        )} */}

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
                              value={email}
                              type="email"
                              name="email"
                              onChange={(e) => setEmail(e.target.value)}
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
                              value={password}
                              type="password"
                              name="password"
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter your password"
                              className="w-full h-[44px] px-3 rounded-[4px] border border-[#cccccc] bg-white text-[14px] text-[#333333] outline-none transition-all focus:border-[#999999] focus:ring-1 focus:ring-[#dddddd]"
                            />
                          </div>
                        </div>

                        {/* Login Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              loginId({ email, password })
                            }}
                            disabled={isPending}
                            className="w-full sm:w-auto px-7 h-[42px] rounded-[4px] text-white text-[13px] font-bold uppercase transition-opacity hover:opacity-90"
                            style={{ backgroundColor: ACCENT }}
                          >
                            {isPending ? <Loader2 /> : "Login"}
                          </button>

                          <a href={`/account/forgotten-password/`}>

                            <button
                              type="button"
                              className="text-[13px] cursor-pointer text-[#555555] underline hover:text-[#222222]"
                            >
                              Forgot Password?
                            </button>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* REGISTER FORM */}
                {isLoggedIn  && addresses?.length === 0  && (
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


                    </div>
                  </div>
                )}


                {!isLoggedIn && (checkoutType === "register" || checkoutType === "guest") && (
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
                      {checkoutType === "register" &&
                        <>
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
                        </>
                      }
                    </div>
                  </div>
                )}

                {/* BILLING ADDRESS */}
                {/* {checkoutType !== "login" && ( */}
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

                  {isLoggedIn && addresses && addresses.length > 0 && (
                    <div className="mb-5 space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="billingAddressMode"
                          value="existing"
                          checked={billingAddressMode === "existing"}
                          onChange={() => setBillingAddressMode("existing")}
                          className="cursor-pointer"
                          style={{ accentColor: ACCENT }}
                        />
                        <span className="text-[14px] font-medium">
                          I want to use an existing address
                        </span>
                      </label>

                      {billingAddressMode === "existing" && (
                        <div className="ml-6">
                          <select
                            value={selectedBillingAddressId}
                            onChange={(e) => setSelectedBillingAddressId(e.target.value)}
                            className={`${inputClass} cursor-pointer max-w-xl`}
                          >
                            <option value="">--- Select an address ---</option>
                            {addresses.map((addr) => (
                              <option
                                key={addr.address_id}
                                value={addr.address_id}
                              >
                                {formatAddressLabel(addr)}
                                {addr.is_default ? " (Default)" : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="billingAddressMode"
                          value="new"
                          checked={billingAddressMode === "new"}
                          onChange={() => setBillingAddressMode("new")}
                          className="cursor-pointer"
                          style={{ accentColor: ACCENT }}
                        />
                        <span className="text-[14px] font-medium">
                          I want to use a new address
                        </span>
                      </label>
                    </div>
                  )}

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isLoggedIn && addresses.length > 0 && billingAddressMode === "existing" ? "opacity-60" : ""}`}>
                    {/* <div>
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
                    </div> */}
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
                {/* )} */}

                {/* SHIPPING ADDRESS — LOCKED until billing above is complete */}
                {/* {checkoutType !== "login" && ( */}
                <div className="bg-[#eeeeee] rounded-[4px] p-6 md:p-8 relative">
                  <div className="flex flex-wrap items-center justify-between mb-2 gap-3">
                    <h2
                      className={`font-sarabun text-[17px] font-bold text-[#333333] pb-2 mb-1 flex items-center gap-2`}
                    >
                      Where would you like to send this gift?

                    </h2>
                  </div>
                  <div
                    className="h-[2px] w-14 mb-4"
                    style={{ backgroundColor: ACCENT }}
                  />

                  {/* {!isBillingComplete && (
                    <div className="mb-5 text-[12px] text-[#9a3412] bg-[#fff7ed] border border-[#fdba74] rounded-[3px] p-3">
                      Please complete your billing address above (name, address, email &amp; telephone) before entering shipping details.
                    </div>
                  )} */}

                  <div
                    className={`transition-opacity`}
                  >
                    <label className="flex items-center gap-2 mb-5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shippingSameAsBilling}
                        onChange={(e) =>
                          toggleShippingSameAsBilling(e.target.checked)
                        }
                        // disabled={!isBillingComplete}
                        className="cursor-pointer"
                        style={{ accentColor: ACCENT }}
                      />
                      <span className="text-[13px] font-medium">
                        My billing and shipping address are the same
                      </span>
                    </label>

                    {isLoggedIn && addresses && addresses.length > 0 && !shippingSameAsBilling && (
                      <div className="mb-5 space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="shippingAddressMode"
                            value="existing"
                            checked={shippingAddressMode === "existing"}
                            onChange={() => setShippingAddressMode("existing")}
                            // disabled={!isBillingComplete}
                            className="cursor-pointer"
                            style={{ accentColor: ACCENT }}
                          />
                          <span className="text-[14px] font-medium">
                            I want to use an existing address
                          </span>
                        </label>

                        {shippingAddressMode === "existing" && (
                          <div className="ml-6">
                            <select
                              value={selectedShippingAddressId}
                              onChange={(e) => setSelectedShippingAddressId(e.target.value)}
                              // disabled={!isBillingComplete}
                              className={`${inputClass} cursor-pointer max-w-xl`}
                            >
                              <option value="">--- Select an address ---</option>
                              {addresses.map((addr) => (
                                <option
                                  key={addr.address_id}
                                  value={addr.address_id}
                                >
                                  {formatAddressLabel(addr)}
                                  {addr.is_default ? " (Default)" : ""}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="shippingAddressMode"
                            value="new"
                            checked={shippingAddressMode === "new"}
                            onChange={() => setShippingAddressMode("new")}
                            // disabled={!isBillingComplete}
                            className="cursor-pointer"
                            style={{ accentColor: ACCENT }}
                          />
                          <span className="text-[14px] font-medium">
                            I want to use a new address
                          </span>
                        </label>
                      </div>
                    )}

                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${shippingSameAsBilling ? "opacity-40 pointer-events-none" : ""
                        } ${isLoggedIn && addresses.length > 0 && !shippingSameAsBilling && shippingAddressMode === "existing" ? "opacity-60" : ""
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
                          value="223"
                          disabled
                          className={`${inputClass} cursor-not-allowed opacity-70`}
                        >
                          <option value="223">United States</option>
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
                {/* )} */}
              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col gap-6 flex-1">
                {/* SHIPPING METHOD */}
                <div className="bg-[#eeeeee] rounded-[4px] p-6">
                  <SectionHeader title="Shipping Method" />

                  <div className="space-y-4">
                    {!effectiveCountryId ? (
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
                            className="flex items-center gap-3 cursor-pointer"
                          // style={{
                          //   borderColor:
                          //     shippingMethod === rate.name
                          //       ? "rgba(140,26,60,0.35)"
                          //       : undefined,
                          //   background:
                          //     shippingMethod === rate.name ? "#f9f9f9" : undefined,
                          // }}
                          >
                            <Truck size={20} className="text-[#333] shrink-0" />

                            <input
                              type="radio"
                              name="shippingMethod"
                              checked={shippingMethod === rate.name}
                              onChange={() => setShippingMethod(rate.name)}
                              className="cursor-pointer"
                              style={{ accentColor: ACCENT }}
                            />

                            <span className="font-medium flex-1">
                              {rate.label}
                            </span>

                            <span className="font-bold whitespace-nowrap">
                              ${rate.price.toFixed(2)}
                            </span>
                          </label>
                        ))}

                        {!shippingRate?.allMatches ||
                          shippingRate.allMatches.length === 0 ? (
                          <div className="text-[12px] text-[#888] bg-white rounded-[3px] p-3 border border-gray-200">
                            Showing default shipping rates. Select a valid address to see
                            location-specific options.
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
                        onChange={handleCouponChange}
                        className="flex-1 border border-gray-200 py-2 px-3 text-[13px] focus:outline-none bg-white"
                      />
                      <button
                        onClick={handleApplingCoupon}
                        className="bg-black text-white px-6 py-2 text-[12px] font-bold uppercase hover:bg-[#98022e] transition-colors cursor-pointer"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                  {/* <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
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
                        // onClick={handleApplyGiftCert}
                        className="bg-black text-white px-6 py-2 text-[12px] font-bold uppercase hover:bg-[#98022e] transition-colors cursor-pointer"
                      >
                        Submit
                      </button>
                    </div>
                  </div> */}
                </div>

                {/* SUPPORT TEAM */}
                <div className="bg-white border border-gray-200 rounded-[4px] p-6 shadow-sm">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-[14px] font-bold text-[#333]">Show your support for the team at DC Wine & Spirits</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-[14px]">
                        <input type="radio" checked={supportTeam === "yes"} onChange={() => setSupportTeam("yes")} className="accent-[#c99000] cursor-pointer" /> Yes
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[14px]">
                        <input type="radio" checked={supportTeam === "no"} onChange={() => { setSupportTeam("no"); setSelectedTip(""); }} className="accent-[#c99000] cursor-pointer" /> No
                      </label>
                    </div>
                  </div>
                  {supportTeam === "yes" && (
                    <div className="mt-3 space-y-3">
                      <select
                        value={selectedTip}
                        onChange={(e) => { setSelectedTip(e.target.value); setCustomTipValue(""); }}
                        className="border border-gray-200 py-2 px-3 rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#c99000] bg-white w-full md:w-56 cursor-pointer"
                      >
                        <option value="">Select tip amount</option>
                        <option value="5%">5% (+${(subTotal * 0.05).toFixed(2)})</option>
                        <option value="10%">10% (+${(subTotal * 0.10).toFixed(2)})</option>
                        <option value="15%">15% (+${(subTotal * 0.15).toFixed(2)})</option>
                        <option value="$5">$5.00</option>
                        <option value="$10">$10.00</option>
                        <option value="$15">$15.00</option>
                        <option value="custom">Custom amount</option>
                      </select>
                      {selectedTip === "custom" && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number" placeholder="Amount in USD"
                            value={customTipValue}
                            onChange={(e) => setCustomTipValue(e.target.value)}
                            className="border border-gray-200 py-2 px-3 rounded text-[13px] w-36 focus:outline-none focus:ring-1 focus:ring-[#c99000]"
                          />
                        </div>
                      )}
                    </div>
                  )}
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
                          href="/products"
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
                                      {decodeHtml(item?.name)}
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
                                <td className="py-4 pr-4 border-b border-gray-200">
                                  <div className="flex items-center gap-1 pl-5">
                                    <div className="relative border border-gray-200 rounded flex items-center">
                                      <input type="number" value={item?.quantity} readOnly className="w-10 text-center py-1 text-[13px] focus:outline-none bg-white" />
                                      <div className="flex flex-col border-l border-gray-200">
                                        <button onClick={() => updateCart({ cart_id: item.cart_id, quantity: item.quantity + 1 })} className="px-1 py-0.5 hover:bg-gray-100 cursor-pointer"><ChevronUp size={10} /></button>
                                        <button onClick={() => item.quantity > 1 && updateCart({ cart_id: item.cart_id, quantity: item.quantity - 1 })} className="px-1 py-0.5 hover:bg-gray-100 border-t border-gray-200 cursor-pointer"><ChevronDown size={10} /></button>
                                      </div>
                                    </div>
                                    <button onClick={() => clearCartMut(item.cart_id)} className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all cursor-pointer">
                                      <X size={13} />
                                    </button>
                                  </div>
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
                        {discountAmount > 0 && <div className="w-full flex justify-end gap-5 bg-[#f9f9f9] p-2 border border-gray-200 border-b-0">
                          <span className="font-bold">
                            Discount Applied: {`${couponData?.coupon?.name} (${couponData?.coupon?.code})`}
                          </span>
                          <span>${discountAmount.toFixed(2)}</span>
                        </div>}
                        {tipAmount > 0 && <div className="w-full flex justify-end gap-5 bg-[#f9f9f9] p-2 border border-gray-200 border-b-0">
                          <span className="font-bold">
                            Tip Amount
                          </span>
                          <span>${tipAmount.toFixed(2)}</span>
                        </div>}
                        <div className="w-full flex justify-end gap-5 bg-[#f9f9f9] p-2 border border-gray-200 border-b-0">
                          <span className="font-bold">
                            Tax (6.25%)
                          </span>
                          <span>${tax.toFixed(2)}</span>
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

                  <div className="bg-white border border-gray-200 rounded-[4px] p-6 shadow-sm">
                    <SectionHeader title="Payment Method" />
                    <label className={`flex flex-col gap-3 border rounded-lg p-4 cursor-pointer ${paymentCode === "stripe" ? "border-2 border-[#c99000] bg-[#fdf8ea]" : "border-gray-200"}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={paymentCode === "stripe"} onChange={() => setPaymentCode("stripe")} className="accent-[#c99000] cursor-pointer" />
                        <p className="text-[14px] font-bold">Credit / Debit Card</p>
                      </div>
                      {paymentCode === "stripe" && (
                        <div className="mt-2 bg-white p-4 border border-gray-300 rounded-[4px]">
                          <CardElement options={{ style: { base: { fontSize: "14px" } } }} />
                        </div>
                      )}
                    </label>
                  </div>

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
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 mt-6 transition-all duration-300 hover:bg-[#98022e] hover:rounded-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:rounded-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
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

                  {orderError && (
                    <p className="mt-4 text-red-500 text-[13px] bg-red-50 border border-red-200 rounded p-3">
                      {orderError}
                    </p>
                  )}

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

const CheckoutPage = () => (
  <Elements stripe={STRIPE_PUBLISHABLE_KEY}>
    <CheckoutClient />
  </Elements>
);

export default CheckoutPage;