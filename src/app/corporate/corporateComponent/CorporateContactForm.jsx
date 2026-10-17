"use client";

import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useContactpost } from "@/app/api/hooks/useContact";

const ACCENT = "#98022e";

const inputClass =
  "w-full px-3 py-2.5 text-sm border border-[#d9d9d9] rounded-[3px] outline-none focus:border-[#98022e] focus:ring-1 focus:ring-[#98022e]/30";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Your name is required"),
  businessName: Yup.string().required("Business name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Your email is required"),
  phone: Yup.string().required("Phone number is required"),
  message: Yup.string().required("Message is required"),
});

const CorporateContactForm = () => {
  const { mutate: contactSubmit, isPending } = useContactpost();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      businessName: "",
      email: "",
      phone: "",
      message: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      contactSubmit({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        message: `Business Name: ${values.businessName}\n\n${values.message}`,
      });
      resetForm();
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
      toast.error(
        firstErrorMessage || "Please fill all required fields correctly",
      );

      const touchedFields = Object.keys(formik.initialValues).reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {},
      );
      formik.setTouched(touchedFields);
      return;
    }

    formik.handleSubmit(e);
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-5 -mt-8 md:-mt-12 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 shadow-lg">
        <div className="relative bg-[#eeeeee] min-h-[260px] md:min-h-[320px]">
          <Image
            src="/corporate/winewarehouse.jpg"
            alt="Wine warehouse"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="bg-white px-6 py-8 md:px-10 md:py-8">
          <h3 className="text-xl font-bold text-center mb-1.5 font-hind-madurai">
            Let&apos;s Get Started
          </h3>
          <p className="text-xs text-center text-[#777] mb-4 leading-relaxed font-hind-madurai">
            Please enter your contact information in the fields below and we
            will be in touch within 24 hours.
          </p>
          <hr className="border-t border-[#e5e5e5] mb-5" />

          <form
            onSubmit={handleFormSubmit}
            className="space-y-4 font-hind-madurai"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("fullName")}
                  className={inputClass}
                />
                {renderError("fullName")}
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("businessName")}
                  className={inputClass}
                />
                {renderError("businessName")}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">
                  Your Email ID
                </label>
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  className={inputClass}
                />
                {renderError("email")}
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5">
                  Your Phone No.
                </label>
                <input
                  type="tel"
                  {...formik.getFieldProps("phone")}
                  className={inputClass}
                />
                {renderError("phone")}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5">
                Message
              </label>
              <textarea
                rows={4}
                {...formik.getFieldProps("message")}
                className={`${inputClass} resize-y`}
              />
              {renderError("message")}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full text-white py-3.5 font-semibold text-sm tracking-wide transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: ACCENT }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#7e1a3c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = ACCENT)
              }
            >
              {isPending ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CorporateContactForm;