"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Asterisk, Loader2 } from "lucide-react";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import AccountSidebar from "@/app/components/AccountSidebar";
import { useCreateAddress } from "@/app/api/hooks/customerAddress/useCreateAddress";
import { useUpdateAddress } from "@/app/api/hooks/customerAddress/useUpdateAddress";
import { useAddressById } from "@/app/api/hooks/customerAddress/useAddressById";
import { useCountryget } from "@/app/api/hooks/customerAddress/useCountryget";
import { useZoneget } from "@/app/api/hooks/customerAddress/useZoneget";

// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

const INITIAL_VALUES = {
  firstname: "",
  lastname: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  postcode: "",
  telephone: "",
  country_id: "223", // default US
  zone_id: "",
  default: false,
};

// Small reusable field wrapper — label + required asterisk + error
const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col md:flex-row md:items-start md:gap-x-4">
    <label className="md:w-40 text-[13px] font-semibold font-hind-madurai text-[#333333] mb-1 md:mb-0 flex items-center shrink-0 md:pt-2.5">
      {label}{" "}
      {required && (
        <Asterisk size={9} className="ml-1" style={{ color: ACCENT }} />
      )}
    </label>
    <div className="flex-1 max-w-2xl">
      {children}
      {error && (
        <p className="text-red-500 text-[11px] mt-1 font-hind-madurai">
          {error}
        </p>
      )}
    </div>
  </div>
);

const AddressCreateForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Step: URL se address_id nikalo -> yehi decide karega Add hai ya Edit
  const addressId = searchParams.get("address_id");
  const isEditMode = !!addressId;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Account", href: "/account" },
    { label: "Address Book", href: "/account/address" },
    { label: isEditMode ? "Edit Address" : "Add Address", href: "#" },
  ];

  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  // --- Data fetching ---
  const { data: countries = [] } = useCountryget();
  const {
    mutate: fetchZones,
    data: zones = [],
    isPending: isLoadingZones,
  } = useZoneget();

  // 2. Step: Agar edit mode hai, toh existing address fetch karo
  const { data: addressData, isLoading: isLoadingAddress } =
    useAddressById(addressId);

  useEffect(() => {
    if (values.country_id) {
      fetchZones(values.country_id);
    }
  }, [values.country_id]);

  // 3. Step: Jaise hi address data aaye, form ko prefill kardo (telephone bhi)
  useEffect(() => {
    if (addressData) {
      setValues({
        firstname: addressData.firstname || "",
        lastname: addressData.lastname || "",
        company: addressData.company || "",
        address_1: addressData.address_1 || "",
        address_2: addressData.address_2 || "",
        city: addressData.city || "",
        postcode: addressData.postcode || "",
        telephone: addressData.telephone || "",
        country_id: String(addressData.country_id || "223"),
        zone_id: String(addressData.zone_id || ""),
        default: !!addressData.default,
      });
    }
  }, [addressData]);

  // --- Mutations ---
  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();

  const isPending = isCreating || isUpdating;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCountryChange = (e) => {
    setValues((prev) => ({ ...prev, country_id: e.target.value, zone_id: "" }));
    if (errors.country_id)
      setErrors((prev) => ({ ...prev, country_id: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!values.firstname.trim())
      newErrors.firstname = "First name is required";
    if (!values.lastname.trim()) newErrors.lastname = "Last name is required";
    if (!values.address_1.trim()) newErrors.address_1 = "Address is required";
    if (!values.city.trim()) newErrors.city = "City is required";
    if (!values.postcode.trim()) newErrors.postcode = "Postcode is required";
    if (!values.telephone.trim())
      newErrors.telephone = "Mobile number is required";
    if (!values.country_id) newErrors.country_id = "Country is required";
    if (!values.zone_id) newErrors.zone_id = "Region / State is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 4. Step: Submit pe decide karo -> create bhejna hai ya update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...values,
      country_id: Number(values.country_id),
      zone_id: Number(values.zone_id),
    };

    if (isEditMode) {
      updateAddress(
        { addressId, payload },
        { onSuccess: () => router.push("/account/address") }
      );
    } else {
      createAddress(payload, {
        onSuccess: () => router.push("/account/address"),
      });
    }
  };

  const inputClass = (field) =>
    `w-full border py-2.5 px-3 rounded-[4px] text-[13px] font-hind-madurai focus:outline-none focus:ring-1 bg-white ${
      errors[field] ? "border-red-500" : "border-gray-200"
    }`;

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      <ProductsHeader
        categoryName={isEditMode ? "Edit Address" : "Add New Address"}
        breadcrumbs={breadcrumbs}
      />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        <form onSubmit={handleSubmit} className="flex-1 min-w-0 w-full">
          <div className="bg-[#f5f5f5] rounded-[4px] px-5 py-8 sm:px-8">
            <div className="space-y-6">
              {/* First Name */}
              <Field label="First Name" required error={errors.firstname}>
                <input
                  type="text"
                  name="firstname"
                  value={values.firstname}
                  onChange={handleChange}
                  className={inputClass("firstname")}
                  placeholder="First Name"
                />
              </Field>

              {/* Last Name */}
              <Field label="Last Name" required error={errors.lastname}>
                <input
                  type="text"
                  name="lastname"
                  value={values.lastname}
                  onChange={handleChange}
                  className={inputClass("lastname")}
                  placeholder="Last Name"
                />
              </Field>

              {/* Company */}
              <Field label="Company">
                <input
                  type="text"
                  name="company"
                  value={values.company}
                  onChange={handleChange}
                  className={inputClass("company")}
                  placeholder="Company"
                />
              </Field>

              {/* Address 1 */}
              <Field label="Address 1" required error={errors.address_1}>
                <input
                  type="text"
                  name="address_1"
                  value={values.address_1}
                  onChange={handleChange}
                  className={inputClass("address_1")}
                  placeholder="Address 1"
                />
              </Field>

              {/* Address 2 */}
              <Field label="Address 2">
                <input
                  type="text"
                  name="address_2"
                  value={values.address_2}
                  onChange={handleChange}
                  className={inputClass("address_2")}
                  placeholder="Address 2"
                />
              </Field>

              {/* City */}
              <Field label="City" required error={errors.city}>
                <input
                  type="text"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  className={inputClass("city")}
                  placeholder="City"
                />
              </Field>

              {/* Postcode */}
              <Field label="Post Code" required error={errors.postcode}>
                <input
                  type="text"
                  name="postcode"
                  value={values.postcode}
                  onChange={handleChange}
                  className={inputClass("postcode")}
                  placeholder="Post Code"
                />
              </Field>

              {/* Mobile Number */}
              <Field label="Mobile Number" required error={errors.telephone}>
                <input
                  type="tel"
                  name="telephone"
                  value={values.telephone}
                  onChange={handleChange}
                  className={inputClass("telephone")}
                  placeholder="Mobile Number"
                />
              </Field>

              {/* Country */}
              <Field label="Country" required error={errors.country_id}>
                <select
                  name="country_id"
                  value={values.country_id}
                  onChange={handleCountryChange}
                  className={inputClass("country_id")}
                >
                  <option value="">--- Please Select ---</option>
                  {countries.map((country) => (
                    <option key={country.country_id} value={country.country_id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Zone */}
              <Field label="Region / State" required error={errors.zone_id}>
                <select
                  name="zone_id"
                  value={values.zone_id}
                  onChange={handleChange}
                  disabled={!values.country_id || isLoadingZones}
                  className={`${inputClass("zone_id")} disabled:opacity-50`}
                >
                  <option value="">
                    {isLoadingZones ? "Loading..." : "--- Please Select ---"}
                  </option>
                  {zones.map((zone) => (
                    <option key={zone.zone_id} value={zone.zone_id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Default Address */}
              <div className="flex flex-col md:flex-row md:items-start md:gap-x-4">
                <label className="md:w-40 text-[13px] font-semibold font-hind-madurai text-[#333333] mb-1 md:mb-0 shrink-0 md:pt-2.5">
                  Default Address
                </label>
                <div className="flex items-center gap-6 pt-2.5 text-[13px] font-hind-madurai">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={values.default === true}
                      onChange={() =>
                        setValues((prev) => ({ ...prev, default: true }))
                      }
                      style={{ accentColor: ACCENT }}
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={values.default === false}
                      onChange={() =>
                        setValues((prev) => ({ ...prev, default: false }))
                      }
                      style={{ accentColor: ACCENT }}
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Back / Save buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              type="button"
              onClick={() => router.push("/account/address")}
              className="flex-1 bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 rounded-[3px] transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isPending || isLoadingAddress}
              className="flex-1 bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 rounded-[3px] transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Saving..." : isEditMode ? "Update Address" : "Save Address"}
            </button>
          </div>
        </form>

        {/* Right Column: Sidebar */}
        <AccountSidebar />
      </div>
    </div>
  );
};

export default AddressCreateForm;