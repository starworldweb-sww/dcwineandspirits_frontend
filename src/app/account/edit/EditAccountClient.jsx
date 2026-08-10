
"use client";
 
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import { useUser, useUpdateAccountInfo } from "@/app/api/hooks/useAuth";
 // apna actual path daal dena
 
// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";
 
const sidebarLinks = [
  { href: "/account", label: "My Account" },
  { href: "/account/address", label: "Address Book" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/order", label: "Order History" },
  { href: "/account/transactions", label: "Transactions" },
];
 
const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Account", href: "/account" },
  { label: "Edit Information", href: "/account/edit" },
];
 
// --- SHARED INPUT STYLE ---
const inputClass =
  "w-full bg-white border border-[#d9d9d9] rounded-[3px] px-3 py-2.5 text-[14px] text-[#333333] placeholder:text-[#9a9a9a] outline-none transition-colors duration-200 focus:border-[#8c1a3c] focus:ring-1 focus:ring-[#8c1a3c]/30";
 
// --- VALIDATION SCHEMA ---
const validationSchema = Yup.object({
  firstname: Yup.string().required("First name is required"),
  lastname: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  telephone: Yup.string().required("Telephone is required"),
});
 
const EditAccountClient = () => {
  const { data: user } = useUser();
  const editAccountMutation = useUpdateAccountInfo();
 
  const formik = useFormik({
    initialValues: {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
      telephone: user?.telephone || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await editAccountMutation.mutateAsync(values);
      } catch (error) {
        // error toast already handled inside useUpdateAccountInfo
      } finally {
        setSubmitting(false);
      }
    },
  });
 
  const renderError = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="text-red-600 text-[12px] mt-1">{formik.errors[field]}</p>
    ) : null;
 
  const handleFormSubmit = (e) => {
    e.preventDefault();
 
    const errors = formik.errors;
    const hasErrors = Object.keys(errors).length > 0;
 
    if (hasErrors) {
      const firstErrorMessage = Object.values(errors)[0];
      toast.error(firstErrorMessage || "Please fill all required fields correctly");
 
      const touchedFields = Object.keys(formik.initialValues).reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {}
      );
      formik.setTouched(touchedFields);
      return;
    }
 
    formik.handleSubmit(e);
  };
 
  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader categoryName="My Account Information" breadcrumbs={breadcrumbs} />
 
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        {/* Personal Details Form */}
        <div className="flex-1 min-w-0 w-full">
          <h2 className="text-[20px] font-hind-madurai font-semibold text-[#333333] pb-3 mb-6 border-b border-[#8c1a3c] inline-block">
            Your Personal Details
          </h2>
 
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 max-w-[560px]">
            <div>
              <label className="block text-[14px] font-hind-madurai text-[#333333] mb-1.5">
                First Name <span style={{ color: ACCENT }}>*</span>
              </label>
              <input
                type="text"
                placeholder="First Name"
                {...formik.getFieldProps("firstname")}
                className={inputClass}
              />
              {renderError("firstname")}
            </div>
 
            <div>
              <label className="block text-[14px] font-hind-madurai text-[#333333] mb-1.5">
                Last Name <span style={{ color: ACCENT }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Last Name"
                {...formik.getFieldProps("lastname")}
                className={inputClass}
              />
              {renderError("lastname")}
            </div>
 
            <div>
              <label className="block text-[14px] font-hind-madurai text-[#333333] mb-1.5">
                E-Mail <span style={{ color: ACCENT }}>*</span>
              </label>
              <input
                type="email"
                placeholder="E-Mail"
                {...formik.getFieldProps("email")}
                className={inputClass}
              />
              {renderError("email")}
            </div>
 
            <div>
              <label className="block text-[14px] font-hind-madurai text-[#333333] mb-1.5">
                Telephone <span style={{ color: ACCENT }}>*</span>
              </label>
              <input
                type="tel"
                placeholder="Telephone"
                {...formik.getFieldProps("telephone")}
                className={inputClass}
              />
              {renderError("telephone")}
            </div>
 
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link href="/account" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-[180px] bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer hover:bg-[#98022e] hover:rounded-xl"
                >
                  Back
                </button>
              </Link>
 
              <button
                type="submit"
                disabled={formik.isSubmitting || editAccountMutation.isPending}
                className="w-full sm:w-[180px] bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#98022e] hover:rounded-xl"
              >
                {editAccountMutation.isPending ? "Saving..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
 
        {/* Right Column: Sidebar */}
        <div className="w-full lg:w-[260px] shrink-0 mt-10 lg:mt-0">
          <div className="bg-[#eeeeee] rounded-[4px] p-5">
            <ul>
              {sidebarLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 py-2.5 text-[15px] font-hind-madurai text-[#333333] transition-colors duration-300"
                  >
                    <ChevronRight
                      size={16}
                      className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                      style={{ color: ACCENT }}
                    />
                    <span className="transition-colors duration-300 group-hover:text-[#8c1a3c]">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default EditAccountClient;