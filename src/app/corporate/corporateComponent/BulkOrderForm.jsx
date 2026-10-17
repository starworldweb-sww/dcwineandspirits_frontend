"use client";

import { useEffect, useRef, useState } from "react";
import { useFormik, getIn, setIn } from "formik";
import {
  TbPlus,
  TbTrash,
  TbLoader2,
  TbCheck,
  TbClipboardText,
} from "react-icons/tb";
import { useCreateBulkOrder } from "@/app/api/hooks/bulkorderr/useCreateBulkOrder";
import { useUser } from "@/app/api/hooks/useAuth";


/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const MAX_ROWS = 100; 
const START_ROWS = 5;

// Same column order as bulk-order-form.xlsx, so pasted Excel rows line up
const ROW_FIELDS = [
  "recipient",
  "address",
  "mobile",
  "product",
  "message",
  "remarks",
];

const COLUMNS = [
  { key: "recipient", label: "Recipients Name", required: true, w: "min-w-[10rem]" },
  { key: "address", label: "Shipping Address", required: true, w: "min-w-[16rem]", multiline: true },
  { key: "mobile", label: "Mobile No.", w: "min-w-[9rem]" },
  { key: "product", label: "Product Name or Item Code", required: true, w: "min-w-[12rem]" },
  { key: "message", label: "Message", w: "min-w-[12rem]", multiline: true },
  { key: "remarks", label: "Remarks", w: "min-w-[10rem]", multiline: true },
];

/* DC theme: maroon #98022e (hover #7a0225), text #1c1f22, grey #eeeeee, white */
const inputCls =
  "w-full border border-gray-300 bg-white px-3 py-2 text-sm text-[#1c1f22] placeholder:text-gray-400 focus:outline-none focus:border-[#98022e] focus:ring-2 focus:ring-[#98022e]/20";

const errorInputCls = "!border-red-600 focus:!ring-red-600/20";

const btnPrimary =
  "inline-flex cursor-pointer items-center justify-center gap-2 bg-[#98022e] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7a0225] disabled:cursor-not-allowed disabled:opacity-60";

const btnOutline =
  "inline-flex cursor-pointer items-center gap-1.5 border border-[#98022e] bg-white px-3 py-2 text-sm font-medium text-[#98022e] transition-colors hover:bg-[#98022e] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#98022e]";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const emptyRow = () => ({
  recipient: "",
  address: "",
  mobile: "",
  product: "",
  message: "",
  remarks: "",
});

const digits = (v) => String(v || "").replace(/\D/g, "");

// Keeps digits only and drops a leading US country code,
// e.g. "+1 (555) 123-4567" -> "5551234567"
const toPhone10 = (v) => {
  let d = digits(v);
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  return d;
};

const isFilled = (row) => ROW_FIELDS.some((f) => String(row[f] ?? "").trim());

const EMAIL_RE = /^\S+@\S+\.\S+$/;

// Small TSV parser for what Excel puts on the clipboard. Quoted cells are
// handled, so an address with a line break stays in one cell.
function parseTSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += ch;
    } else if (ch === '"' && cell === "") {
      quoted = true;
    } else if (ch === "\t") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

/* -------------------------------------------------------------------------- */
/*  Validation                                                                */
/* -------------------------------------------------------------------------- */

function validate(v) {
  let errors = {};
  const add = (path, msg) => {
    errors = setIn(errors, path, msg);
  };

  // Customer details
  const c = v.customer;
  if (!c.name.trim()) add("customer.name", "Name is required.");
  if (!c.email.trim()) add("customer.email", "E-Mail is required.");
  else if (!EMAIL_RE.test(c.email.trim())) add("customer.email", "Enter a valid email.");
  if (!c.mobile.trim()) add("customer.mobile", "Mobile number is required.");
  else if (toPhone10(c.mobile).length < 10) add("customer.mobile", "Enter at least 10 digits.");
  if (!c.billing.trim()) add("customer.billing", "Billing address is required.");

  // Recipient rows. Rows with nothing in them are skipped, same as the Excel form.
  const filled = v.rows.map((r, i) => (isFilled(r) ? i : -1)).filter((i) => i >= 0);

  if (filled.length === 0) {
    add("rows.0.recipient", "Add at least one recipient.");
    add("rows.0.address", "Required.");
    add("rows.0.product", "Required.");
  } else {
    filled.forEach((i) => {
      const r = v.rows[i];
      if (!r.recipient.trim()) add(`rows.${i}.recipient`, "Required.");
      if (!r.address.trim()) add(`rows.${i}.address`, "Required.");
      if (!r.product.trim()) add(`rows.${i}.product`, "Required.");
      if (r.mobile.trim() && toPhone10(r.mobile).length < 10)
        add(`rows.${i}.mobile`, "Min. 10 digits.");
    });
  }

  return errors;
}

/* -------------------------------------------------------------------------- */
/*  Payload (what goes to the backend)                                        */
/* -------------------------------------------------------------------------- */

const buildPayload = (v) => ({
  customer: {
    name: v.customer.name.trim(),
    email: v.customer.email.trim(),
    mobile: toPhone10(v.customer.mobile),
    company: v.customer.company.trim(),
    billing: v.customer.billing.trim(),
  },
  // Filled rows only, renumbered from 1 (the Sr. No. column in the Excel form)
  rows: v.rows
    .filter(isFilled)
    .map((r, i) => ({
      srNo: i + 1,
      recipient: r.recipient.trim(),
      address: r.address.trim(),
      mobile: r.mobile.trim() ? toPhone10(r.mobile) : "",
      product: r.product.trim(),
      message: r.message.trim(),
      remarks: r.remarks.trim(),
    })),
  instructions: v.instructions.trim(),
});

/* -------------------------------------------------------------------------- */
/*  Small UI pieces                                                           */
/* -------------------------------------------------------------------------- */

function Field({ formik, name, label, required, className = "", multiline, ...props }) {
  const error = getIn(formik.touched, name) && getIn(formik.errors, name);
  const Tag = multiline ? "textarea" : "input";
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-[#1c1f22]">
        {label}
        {required && <span className="text-[#98022e]"> *</span>}
      </span>
      <Tag
        {...formik.getFieldProps(name)}
        {...props}
        className={`${inputCls} ${error ? errorInputCls : ""}`}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function Section({ title, hint, right, children }) {
  return (
    <section className="overflow-hidden border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-[#eeeeee] px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-[#1c1f22]">{title}</h3>
          {hint && <p className="mt-0.5 text-xs text-gray-600">{hint}</p>}
        </div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

// A single cell in the recipients grid
function Cell({ formik, index, col, onPaste }) {
  const name = `rows.${index}.${col.key}`;
  const error = getIn(formik.touched, name) && getIn(formik.errors, name);
  const Tag = col.multiline ? "textarea" : "input";
  return (
    <td className={`px-2 py-2 align-top ${col.w}`}>
      <Tag
        {...formik.getFieldProps(name)}
        {...(col.multiline ? { rows: 2 } : {})}
        {...(col.key === "mobile" ? { inputMode: "tel" } : {})}
        autoComplete="off" // keeps the browser's saved-address dropdown from covering the grid
        aria-label={`${col.label}, row ${index + 1}`}
        onPaste={(e) => onPaste(e, index, col.key)}
        className={`${inputCls} ${error ? errorInputCls : ""}`}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </td>
  );
}

/* -------------------------------------------------------------------------- */
/*  Form                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Props:
 *  - onSubmit(payload): optional async handler. If passed, it is used instead
 *    of the default API call from useCreateBulkOrder.
 *  - onDone(): optional, called when the user clicks "Close" on the success screen.
 */
export function BulkOrderForm({ onSubmit, onDone }) {
  const [submitError, setSubmitError] = useState("");
  const [pasteNote, setPasteNote] = useState("");
  const [done, setDone] = useState(null); // { count } after a successful submit

  // mutateAsync so the await / try-catch in onSubmit works
  const { mutateAsync: createBulkOrder } = useCreateBulkOrder();

  // Logged in user (data is null when nobody is signed in)
  const { data: user } = useUser();
  const prefilledRef = useRef(false); // prefill once, not on every user refetch

  const formik = useFormik({
    initialValues: {
      customer: { name: "", email: "", mobile: "", company: "", billing: "" },
      rows: Array.from({ length: START_ROWS }, emptyRow),
      instructions: "",
    },
    validate,
    onSubmit: async (values) => {
      setSubmitError("");
      const payload = buildPayload(values);
      try {
        // A passed-in handler wins, otherwise call the API through the hook
        if (onSubmit) await onSubmit(payload);
        else await createBulkOrder(payload);
        setDone({ count: payload.rows.length });
      } catch (err) {
        setSubmitError(
          err?.response?.data?.message ||
            err?.message ||
            "Could not send the bulk order. Please try again.",
        );
      }
    },
  });

  // Fill name, email and mobile from the profile, but only the fields still empty
  useEffect(() => {
    if (!user || prefilledRef.current) return;
    prefilledRef.current = true;

    // Field names depend on the profile API response, adjust if they differ
    const fullName =
      user.name || `${user.firstname || ""} ${user.lastname || ""}`.trim();
    const email = user.email || "";
    const mobile = toPhone10(user.telephone || user.mobile || user.phone || "");

    const c = formik.values.customer;
    // false = skip validation so no error flashes before the user touches anything
    if (fullName && !c.name) formik.setFieldValue("customer.name", fullName, false);
    if (email && !c.email) formik.setFieldValue("customer.email", email, false);
    if (mobile && !c.mobile) formik.setFieldValue("customer.mobile", mobile, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const { values: v } = formik;
  const filledCount = v.rows.filter(isFilled).length;
  const busy = formik.isSubmitting;

  const addRow = () => {
    if (v.rows.length >= MAX_ROWS) return;
    formik.setFieldValue("rows", [...v.rows, emptyRow()]);
  };

  const removeRow = (index) => {
    if (v.rows.length <= 1) return;
    formik.setFieldValue("rows", v.rows.filter((_, i) => i !== index));
    // Row positions shifted, so the old per-row touched flags no longer match
    formik.setFieldTouched("rows", false, false);
  };

  // Handles pasting several cells at once from Excel or Google Sheets
  const handlePaste = (e, rowIndex, colKey) => {
    const text = e.clipboardData.getData("text");
    if (!text.includes("\t") && !/[\r\n]/.test(text.trim())) return; // plain single-cell paste, let it through
    e.preventDefault();

    const grid = parseTSV(text).map((cells) =>
      cells.map((c) => c.replace(/\s*[\r\n]+\s*/g, ", ").trim()),
    );
    const startCol = ROW_FIELDS.indexOf(colKey);
    const next = v.rows.map((r) => ({ ...r }));
    let skipped = 0;

    grid.forEach((cells, li) => {
      const ri = rowIndex + li;
      if (ri >= MAX_ROWS) {
        skipped++;
        return;
      }
      while (next.length <= ri) next.push(emptyRow());
      cells.forEach((cell, ci) => {
        const key = ROW_FIELDS[startCol + ci];
        if (key) next[ri][key] = cell;
      });
    });

    formik.setFieldValue("rows", next);
    setPasteNote(
      skipped
        ? `Pasted. ${skipped} row(s) were left out because the form allows ${MAX_ROWS} recipients.`
        : "",
    );
  };

  const startAgain = () => {
    formik.resetForm();
    setDone(null);
    setSubmitError("");
    setPasteNote("");
    // Let the profile prefill run again after the reset
    prefilledRef.current = false;
  };

  /* ------------------------------ Success view ----------------------------- */
  if (done) {
    return (
      <div className="mx-auto max-w-xl border border-gray-200 bg-white p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center bg-[#98022e] text-white">
          <TbCheck size={24} />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-[#1c1f22]">Bulk order sent</h2>
        <p className="mt-1 text-sm text-gray-600">
          {done.count} recipient{done.count > 1 ? "s" : ""} received. We will contact you on the
          email you entered if anything needs fixing.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={startAgain} className={btnOutline}>
            Place another bulk order
          </button>
          {onDone && (
            <button type="button" onClick={onDone} className={btnPrimary}>
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------- Form view ------------------------------ */
  return (
    <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
      {/* Customer details */}
      <Section title="Your details" hint="We use these to contact you about this order.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field formik={formik} name="customer.name" label="Name" required autoComplete="name" />
          <Field
            formik={formik}
            name="customer.email"
            label="E-Mail ID"
            required
            type="email"
            autoComplete="email"
          />
          <Field
            formik={formik}
            name="customer.mobile"
            label="Mobile No."
            required
        
            inputMode="tel"
            autoComplete="tel"
          />
          <Field
            formik={formik}
            name="customer.company"
            label="Company Name"
            autoComplete="organization"
          />
          <Field
            formik={formik}
            name="customer.billing"
            label="Billing Address"
            required
            multiline
            rows={2}
            className="sm:col-span-2"
          />
        </div>
      </Section>

      {/* Recipients grid */}
      <Section
        title="Recipients"
        hint={`Up to 100 recipients. Empty rows are ignored. You can paste rows copied from Excel.`}
       
      >
        <div className="overflow-x-auto border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#eeeeee]">
              <tr>
                <th className="w-10 px-3 py-2 text-left text-xs font-semibold text-[#1c1f22]">
                  Sr. No.
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={`px-2 py-2 text-left text-xs font-semibold text-[#1c1f22] ${col.w}`}
                  >
                    {col.label}
                    {col.required && <span className="text-[#98022e]"> *</span>}
                  </th>
                ))}
                <th className="w-10 px-2 py-2">
                  <span className="sr-only">Remove row</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {v.rows.map((row, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 align-top text-sm font-medium text-gray-500">
                    <div className="flex h-[38px] items-center">{i + 1}</div>
                  </td>
                  {COLUMNS.map((col) => (
                    <Cell key={col.key} formik={formik} index={i} col={col} onPaste={handlePaste} />
                  ))}
                  <td className="px-2 py-2 align-top">
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      disabled={v.rows.length <= 1}
                      title="Remove this row"
                      aria-label={`Remove row ${i + 1}`}
                      className="flex h-[38px] w-8 cursor-pointer items-center justify-center text-gray-400 transition-colors hover:bg-[#eeeeee] hover:text-[#98022e] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    >
                      <TbTrash size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={addRow}
            disabled={v.rows.length >= MAX_ROWS}
            className={btnOutline}
          >
            <TbPlus size={16} />
            {v.rows.length >= MAX_ROWS ? `Maximum ${MAX_ROWS} rows` : "Add row"}
          </button>
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
            <TbClipboardText size={15} />
            Click the first cell, then paste to fill many rows at once.
          </span>
        </div>

        {pasteNote && (
          <p className="mt-3 bg-[#eeeeee] px-3 py-2 text-sm text-[#1c1f22]">
            {pasteNote}
          </p>
        )}
      </Section>

      {/* Instructions */}
      <Section title="Instructions" hint="Anything we should know about this order (optional).">
        <Field formik={formik} name="instructions" label="Instructions" multiline rows={4} />
      </Section>

      {/* Footer */}
      <div>
        {submitError && (
          <p
            role="alert"
            className="mb-3 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {submitError}
          </p>
        )}
        {formik.submitCount > 0 && !formik.isValid && (
          <p
            role="alert"
            className="mb-3 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            Please fix the highlighted fields.
          </p>
        )}
        <div className="flex justify-end">
          <button type="submit" disabled={busy} className={`${btnPrimary} px-6 py-2.5`}>
            {busy && <TbLoader2 size={16} className="animate-spin" />}
            {busy
              ? "Sending…"
              : `Send bulk order${filledCount ? ` (${filledCount})` : ""}`}
          </button>
        </div>
      </div>
    </form>
  );
}