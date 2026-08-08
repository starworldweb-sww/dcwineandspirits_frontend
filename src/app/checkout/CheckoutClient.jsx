"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Truck, ChevronUp, ChevronDown, X, RefreshCw, CreditCard } from "lucide-react";
import { toast } from "sonner";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb"; // login wale jaisa hi header
import Modal from "@/app/components/ui/Modal";
import PrivacyPolicyContent from "@/app/components/ui/PrivacyPolicyContent";
import TermsAndConditions from "@/app/components/ui/TermsAndConditions";

// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

// --- BREADCRUMBS (login page wale pattern jaisa) ---
const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Shopping Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout" },
];

// ── Reusable section header (accent underline) ──
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
  "w-full border border-gray-200 py-2 px-3 rounded-[3px] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#8c1a3c] bg-white";

// ── Static country / region options — no API ──
const COUNTRIES = ["United States"];
const REGIONS = ["--- Please Select ---", "Washington DC", "Virginia", "Maryland"];

// ── Static shipping methods ──
const SHIPPING_METHODS = [
  { id: "standard", label: "Standard Delivery $20/item (Delivery may take 2 to 3 days)", price: 40.0 },
  { id: "same_day", label: "Same Day Delivery (Only in DC and Northern VA, order must be before 2:00PM)", price: 100.0 },
];

// ── Static cart data — no API ──
const CART_ITEMS = [
  {
    id: 1,
    image: "/placeholder-product.png",
    name: "La Marca Prosecco And Flutes Gift Set",
    slug: "la-marca-prosecco-and-flutes-gift-set",
    model: "dcgb390",
    quantity: 1,
    unitPrice: 99.0,
  },
  {
    id: 2,
    image: "/placeholder-product.png",
    name: "Veuve Clicquot Bon Appetit Champagne Gift Basket",
    slug: "veuve-clicquot-bon-appetit-champagne-gift-basket",
    model: "dcgb214",
    quantity: 1,
    unitPrice: 59.31,
  },
];

const CheckoutClient = () => {
  const [billing, setBilling] = useState({
    firstname: "",
    lastname: "",
    company: "",
    address_1: "",
    address_2: "",
    city: "",
    postcode: "",
    country: "United States",
    region: REGIONS[0],
  });

  const [shippingAddress, setShippingAddress] = useState({
    firstname: "",
    lastname: "",
    company: "",
    address_1: "",
    address_2: "",
    city: "",
    postcode: "",
    country: "United States",
    region: REGIONS[0],
    telephone: "",
  });

  const [payment, setPayment] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    country: "United States",
    zip: "",
  });

  const [orderNote, setOrderNote] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0].id);
  const [coupon, setCoupon] = useState("");
  const [giftCert, setGiftCert] = useState("");
  const [supportTeam, setSupportTeam] = useState("no");
  const [cartItems, setCartItems] = useState(CART_ITEMS);

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const setQuantity = (id, value) => {
    const qty = Math.max(1, Number(value) || 1);
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRefreshQuantity = (id) => {
    toast.success("Cart updated");
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  const handleApplyCoupon = () => {
    if (!coupon.trim()) return;
    toast.success("Coupon submitted");
  };

  const handleApplyGiftCert = () => {
    if (!giftCert.trim()) return;
    toast.success("Gift certificate submitted");
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subTotal = cartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const selectedShipping = SHIPPING_METHODS.find((r) => r.id === shippingMethod);
  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const taxRate = 0.0625;
  const tax = subTotal * taxRate;
  const total = subTotal + shippingCost + tax;

  const handlePlaceOrder = () => {
    if (!billing.firstname || !billing.address_1 || !billing.city || !billing.postcode) {
      toast.error("Please fill in all required billing fields");
      return;
    }
    if (!agreePrivacy || !agreeTerms) {
      toast.error("Please agree to the Privacy Policy and Terms & Conditions");
      return;
    }
    toast.success("Order placed (demo — no backend connected)");
  };

  return (
    <main className="font-hind-madurai text-[#333333] mb-10">
      <div className="flex flex-col w-full">
        {/* Page header — login page wale jaisa hi */}
        <ProductsHeader categoryName="Checkout" breadcrumbs={breadcrumbs} />

        <div className="bg-[#f7f7f7] pb-10 w-full pt-8">
          <div className="max-w-[1400px] mx-auto px-3 2xl:px-20">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* ── Left column: Billing Address ── */}
              <div className="lg:w-[45%]">
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

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[13px] font-medium mb-1">
                        First Name <span className="text-red-500">*</span>
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
                      <label className="block text-[13px] font-medium mb-1">Last Name</label>
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
                      <label className="block text-[13px] font-medium mb-1">Company</label>
                      <input
                        type="text"
                        name="company"
                        placeholder="Company"
                        value={billing.company}
                        onChange={handleBillingChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium mb-1">
                        Address 1 <span className="text-red-500">*</span>
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

                    <div>
                      <label className="block text-[13px] font-medium mb-1">Address 2</label>
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
                      <label className="block text-[13px] font-medium mb-1">
                        City <span className="text-red-500">*</span>
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
                      <label className="block text-[13px] font-medium mb-1">
                        Post Code <span className="text-red-500">*</span>
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
                      <label className="block text-[13px] font-medium mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="country"
                        value={billing.country}
                        onChange={handleBillingChange}
                        className={`${inputClass} cursor-pointer`}
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium mb-1">
                        Region / State <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="region"
                        value={billing.region}
                        onChange={handleBillingChange}
                        className={`${inputClass} cursor-pointer`}
                      >
                        {REGIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Where would you like to send this gift? */}
                <div className="bg-[#eeeeee] rounded-[4px] p-6 md:p-8 mt-6">
                  <h2
                    className={`font-sarabun text-[17px] font-bold text-[#333333] pb-2 mb-1`}
                  >
                    Where would you like to send this gift?
                  </h2>
                  <div
                    className="h-[2px] w-14 mb-6"
                    style={{ backgroundColor: ACCENT }}
                  />

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[13px] font-medium mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={shippingAddress.firstname}
                        onChange={handleShippingChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        value={shippingAddress.lastname}
                        onChange={handleShippingChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium mb-1">Company</label>
                      <input
                        type="text"
                        name="company"
                        placeholder="Company"
                        value={shippingAddress.company}
                        onChange={handleShippingChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium mb-1">
                        Address 1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address_1"
                        placeholder="Address 1"
                        value={shippingAddress.address_1}
                        onChange={handleShippingChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium mb-1">Address 2</label>
                      <input
                        type="text"
                        name="address_2"
                        placeholder="Address 2"
                        value={shippingAddress.address_2}
                        onChange={handleShippingChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium mb-1">
                        Post Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        placeholder="Post Code"
                        value={shippingAddress.postcode}
                        onChange={handleShippingChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleShippingChange}
                        className={`${inputClass} cursor-pointer`}
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium mb-1">
                        Region / State <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="region"
                        value={shippingAddress.region}
                        onChange={handleShippingChange}
                        className={`${inputClass} cursor-pointer`}
                      >
                        {REGIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium mb-1">
                        Recipients Mobile No.
                      </label>
                      <input
                        type="tel"
                        name="telephone"
                        placeholder="Recipients Mobile No."
                        value={shippingAddress.telephone}
                        onChange={handleShippingChange}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Right column ── */}
              <div className="flex flex-col gap-6 flex-1">
                {/* Shipping Method */}
                <div className="bg-[#eeeeee] rounded-[4px] p-6">
                  <SectionHeader title="Shipping Method" />
                  <div className="space-y-4">
                    {SHIPPING_METHODS.map((rate) => (
                      <label
                        key={rate.id}
                        className="flex items-center gap-3 text-[14px] cursor-pointer"
                      >
                        <Truck size={20} className="text-[#333] shrink-0" />
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === rate.id}
                          onChange={() => setShippingMethod(rate.id)}
                          className="cursor-pointer"
                          style={{ accentColor: ACCENT }}
                        />
                        <span className="font-medium">
                          {rate.label} - ${rate.price.toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Coupon / Gift Certificate */}
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

                {/* Support team */}
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

                {/* Cart Details */}
                <div>
                  <h2
                    className={`font-sarabun text-[20px] font-bold text-[#333333] pb-2 mb-4 border-b border-[#98022e] inline-block`}
                  >
                    Cart Details
                  </h2>

                  {cartItems.length === 0 ? (
                    <div className="py-10 text-center text-[14px] text-gray-600 font-medium">
                      Your cart is empty.
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
                              <th className="p-3 text-center">Quantity</th>
                              <th className="p-3 text-right">Unit Price</th>
                              <th className="p-3 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cartItems.map((item) => (
                              <tr key={item.id} className="border-t border-gray-200">
                                <td className="p-3 w-20">
                                  <div className="w-14 h-16 relative">
                                    <Image
                                      fill
                                      loading="lazy"
                                      src={item.image}
                                      alt={item.name}
                                      className="object-contain"
                                    />
                                  </div>
                                </td>
                                <td className="p-3">
                                  <Link href={`/${item.slug}`}>
                                    <p className="font-medium" style={{ color: ACCENT }}>
                                      {item.name}
                                    </p>
                                  </Link>
                                </td>
                                <td className="p-3 text-center text-[#444444]">{item.model}</td>
                                <td className="p-3">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <div className="relative border border-gray-200 rounded flex items-center bg-white">
                                      <input
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(e) => setQuantity(item.id, e.target.value)}
                                        className="w-10 text-center py-1 text-[13px] focus:outline-none bg-white"
                                      />
                                      <div className="flex flex-col border-l border-gray-200">
                                        <button
                                          onClick={() => updateQuantity(item.id, 1)}
                                          className="px-1 py-0.5 hover:bg-gray-100 cursor-pointer"
                                        >
                                          <ChevronUp size={10} />
                                        </button>
                                        <button
                                          onClick={() => updateQuantity(item.id, -1)}
                                          className="px-1 py-0.5 hover:bg-gray-100 border-t border-gray-200 cursor-pointer"
                                        >
                                          <ChevronDown size={10} />
                                        </button>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleRefreshQuantity(item.id)}
                                      title="Update quantity"
                                      className="w-8 h-8 bg-black text-white flex items-center justify-center hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                                    >
                                      <RefreshCw size={13} />
                                    </button>
                                    <button
                                      onClick={() => removeItem(item.id)}
                                      title="Remove item"
                                      className="w-8 h-8 bg-black text-white flex items-center justify-center hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                                    >
                                      <X size={13} />
                                    </button>
                                  </div>
                                </td>
                                <td className="p-3 text-right">${item.unitPrice.toFixed(2)}</td>
                                <td className="p-3 text-right">
                                  ${(item.quantity * item.unitPrice).toFixed(2)}
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
                            {selectedShipping?.label.split(" (")[0] || "Shipping"}:
                          </span>
                          <span>${shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="w-full flex justify-end gap-5 bg-[#f9f9f9] p-2 border border-gray-200 border-b-0">
                          <span className="font-bold">Tax (6.25%):</span>
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

                {/* Payment Details */}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[13px] font-medium mb-1">Card number</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 1234 1234 1234"
                          value={payment.cardNumber}
                          onChange={handlePaymentChange}
                          className={`${inputClass} pr-32`}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#1a1f71] text-white">VISA</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#eb001b] text-white">MC</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#2e77bc] text-white">AMEX</span>
                          <CreditCard size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium mb-1">Expiration date</label>
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM / YY"
                        value={payment.expiry}
                        onChange={handlePaymentChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium mb-1">Security code</label>
                      <input
                        type="text"
                        name="cvc"
                        placeholder="CVC"
                        value={payment.cvc}
                        onChange={handlePaymentChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium mb-1">Country</label>
                      <select
                        name="country"
                        value={payment.country}
                        onChange={handlePaymentChange}
                        className={`${inputClass} cursor-pointer`}
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium mb-1">ZIP code</label>
                      <input
                        type="text"
                        name="zip"
                        placeholder="12345"
                        value={payment.zip}
                        onChange={handlePaymentChange}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Message / Gift Note / Order Instructions / Comment */}
                <div className="bg-[#eeeeee] rounded-[4px] p-6">
                  <h2
                    className={`font-sarabun text-[17px] font-bold text-[#333333] pb-2 mb-1`}
                  >
                    Message/Gift Note/Order Instructions/Comment
                  </h2>
                  <div
                    className="h-[2px] w-14 mb-6"
                    style={{ backgroundColor: ACCENT }}
                  />

                  <textarea
                    placeholder="Message/Gift Note/Order Instructions/Comment"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    rows={5}
                    className="w-full border border-gray-200 rounded-[3px] py-2.5 px-3 text-[13px] resize-y focus:outline-none focus:ring-1 focus:ring-[#8c1a3c] bg-white"
                  />

                  <div className="mt-4 space-y-2">
                

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
                    className="w-full bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 mt-6 transition-colors duration-300 hover:bg-[#98022e] hover:rounded-xl cursor-pointer "
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

   

      {/* ================= TERMS & CONDITIONS MODAL ================= */}
      <Modal
        open={isTermsModalOpen}
        onOpenChange={setIsTermsModalOpen}
        title="Terms & Conditions"
      >
        <TermsAndConditions />
      </Modal>
    </main>
  );
};

export default CheckoutClient;