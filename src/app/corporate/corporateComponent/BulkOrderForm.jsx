"use client";

import { useEffect, useRef, useState } from "react";
import { useFormik, getIn, setIn } from "formik";
import {
  TbPlus,
  TbTrash,
  TbLoader2,
  TbCheck,
  TbClipboardText,
  TbFileSpreadsheet,
} from "react-icons/tb";
import { toast } from "sonner";
import { useCreateBulkOrder } from "@/app/api/hooks/bulkorderr/useCreateBulkOrder";
import { useUser } from "@/app/api/hooks/useAuth";
import { useSearchResults } from "@/app/api/hooks/useSearchResults"; // path apne hooks file ke hisaab se adjust karna

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const MAX_ROWS = 100;
const START_ROWS = 5;

// Excel template (put bulk-order-form.xlsx inside /public).
// IMPORTANT: change the cell addresses below to match your real template.
const TEMPLATE = {
  url: "/bulk-order-form.xlsx",
  sheetIndex: 0,
  fileName: "bulk_order.xlsx",
  firstRow: 12, // first recipient row in the template
  // Customer block cells
  customer: {
    name: "C4",
    email: "C5",
    mobile: "C6",
    company: "C7",
    billing: "C8",
  },
  instructions: "C9",
  // Logo / image shown in the exported file (put it in /public).
  // tl = top-left cell (0-based col/row), ext = size in pixels. Set logo: null to skip.
  logo: {
    url: "/logo.png",
    extension: "png", // "png" or "jpeg"
    tl: { col: 0, row: 0 },
    ext: { width: 180, height: 60 },
  },
  // Column widths (characters). Make bigger if text still looks cramped.
  colWidths: { A: 8, B: 26, C: 48, D: 18, E: 34, F: 34, G: 28 },
  // Recipients grid columns
  cols: {
    srNo: "A",
    recipient: "B",
    address: "C",
    mobile: "D",
    product: "E",
    mpn: null, // SKU / MPN ka column letter (jaise "F"). Template mein column nahi hai to null rehne do
    message: "F",
    remarks: "G",
  },
};

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
  { key: "mpn", label: "SKU / MPN", w: "min-w-[9rem]" }, // product pick karne par auto-fill hota hai
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
  mpn: "",
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

// Product ki image ka URL nikalta hai. Field ka naam apne API ke hisaab se adjust karna.
// OpenCart ki images aksar relative path hoti hain, to .env mein
// NEXT_PUBLIC_PRODUCTION_IMAGE_URL set karo (jaise "https://www.dcwineandspirits.com/image/").
const IMAGE_BASE = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL || "";
const PLACEHOLDER_IMG = "/placeholder.png"; // /public mein rakho

const getProductImage = (item) => {
  const src =
    item.image || item.thumb || item.main_image || item.images?.[0] || "";
  if (!src) return "";
  return /^https?:\/\//.test(src) || src.startsWith("/")
    ? src
    : `${IMAGE_BASE}${src}`;
};

// API ka text aksar HTML-encoded aur kabhi leading space ke saath aata hai
// (jaise " Moet &amp; Chandon"). Cell mein bharne se pehle saaf kar do.
const HTML_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", "#39": "'", "#039": "'" };
const cleanText = (v) =>
  String(v ?? "")
    .replace(/&(amp|lt|gt|quot|apos|#0?39);/g, (_, e) => HTML_ENTITIES[e])
    .trim();

// Product pick hone par uski SKU / MPN yahan se fetch hoti hai (jab search result mein na ho).
// { success, data: { sku, mpn, ... } } maana gaya hai. Auth header lagta ho to yahin add karo.
const PRODUCT_DETAIL_URL = (id) => `${process.env.NEXT_PUBLIC_BACKEDN_URL}/products/single-product/${id}`;

async function fetchProductDetail(id) {
  try {
    const res = await fetch(PRODUCT_DETAIL_URL(id));
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null; // fetch fail hua to cell khali rehne do, form na ruke
  }
}

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
      mpn: String(r.mpn ?? "").trim(),
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

// Product column ka cell, jisme typing par product suggestions (image ke saath) aate hain
function ProductCell({ formik, index, col, onPaste }) {
  const name = `rows.${index}.${col.key}`;
  const error = getIn(formik.touched, name) && getIn(formik.errors, name);
  const fieldProps = formik.getFieldProps(name);
  const typedValue = String(fieldProps.value || "");

  const [isOpen, setIsOpen] = useState(false); // dropdown khula hai ya nahi
  const [debouncedValue, setDebouncedValue] = useState(""); // typing ruk jaane ke baad ki value
  const [dropdownPos, setDropdownPos] = useState(null); // dropdown ki screen position
  const inputRef = useRef(null);
  const lastPickedMpn = useRef(""); // auto-fill hui MPN yaad rakhne ke liye
  const pickToken = useRef(0); // late aane wali fetch ko ignore karne ke liye

  // 1. Debounce: user 300ms ruke tabhi search karo
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(typedValue.trim()), 300);
    return () => clearTimeout(timer);
  }, [typedValue]);

  // 2. Search hook: sirf focused cell mein, aur kam se kam 2 characters par
  const { data } = useSearchResults({
    search: debouncedValue,
    limit: 8,
    options: { enabled: isOpen && debouncedValue.length >= 2 },
  });
  const suggestions = data?.pages?.[0]?.products?.items || [];

  // 3. Dropdown ko input ke neeche fixed position par kholo
  //    (table ka overflow-x-auto absolute dropdown ko kaat deta hai)
  const openDropdown = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 2,
      left: rect.left,
      width: Math.max(rect.width, 320), // image + naam ke liye thoda chaura
    });
    setIsOpen(true);
  };

  // 4. Page scroll ya resize par dropdown band karo (warna galat jagah dikhega)
  //    Dropdown ke andar ka apna scroll ignore hota hai.
  useEffect(() => {
    if (!isOpen) return;
    const close = (e) => {
      if (e?.target?.closest?.("[data-product-dropdown]")) return;
      setIsOpen(false);
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [isOpen]);

  // 5. Suggestion pe click karne par uska naam cell mein bhar do
  //    Saath mein SKU / MPN bhi bhar do (agar product ke paas hai)
  const mpnPath = `rows.${index}.mpn`;
  const pickSuggestion = async (item) => {
    // Search result mein SKU / MPN ho to turant bhar do
    const quick = cleanText(item.mpn || item.sku);
    const token = ++pickToken.current;
    lastPickedMpn.current = quick;
    formik.setFieldValue(name, cleanText(item.name));
    formik.setFieldValue(mpnPath, quick);
    setIsOpen(false);
    if (quick) return;

    // Nahi hai to product detail se fetch karo
    const id = item.product_id ?? item.id;
    if (!id) return;
    const detail = await fetchProductDetail(id);
    if (token !== pickToken.current) return; // beech mein dusra product chuna ya naam badla
    const fetched = cleanText(detail?.mpn || detail?.sku);
    if (!fetched) return;
    lastPickedMpn.current = fetched;
    formik.setFieldValue(mpnPath, fetched);
  };

  const showDropdown =
    isOpen && dropdownPos && debouncedValue.length >= 2 && suggestions.length > 0;

  return (
    <td className={`px-2 py-2 align-top ${col.w}`}>
      <input
        {...fieldProps}
        ref={inputRef}
        autoComplete="off"
        aria-label={`${col.label}, row ${index + 1}`}
        onFocus={openDropdown}
        onChange={(e) => {
          fieldProps.onChange(e);
          pickToken.current++; // chal rahi fetch ka result ab ignore hoga
          // Product badal diya, to auto-fill hui purani MPN hata do (user ki likhi hui nahi)
          const currentMpn = String(getIn(formik.values, mpnPath) ?? "");
          if (lastPickedMpn.current && currentMpn === lastPickedMpn.current) {
            formik.setFieldValue(mpnPath, "");
            lastPickedMpn.current = "";
          }
          openDropdown();
        }}
        onBlur={(e) => {
          fieldProps.onBlur(e);
          setIsOpen(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setIsOpen(false);
        }}
        onPaste={(e) => onPaste(e, index, col.key)}
        className={`${inputCls} ${error ? errorInputCls : ""}`}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}

      {showDropdown && (
        <ul
          data-product-dropdown
          style={{
            position: "fixed",
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 50,
          }}
          className="max-h-72 overflow-y-auto border border-gray-300 bg-white shadow-lg"
        >
          {suggestions.map((item, i) => (
            <li key={item.product_id ?? item.id ?? `${item.name}-${i}`}>
              <button
                type="button"
                // onMouseDown (onClick nahi) taaki input ka blur pehle dropdown band na kare
                onMouseDown={(e) => {
                  e.preventDefault();
                  pickSuggestion(item);
                }}
                className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left text-sm text-[#1c1f22] hover:bg-[#eeeeee]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getProductImage(item) || PLACEHOLDER_IMG}
                  alt=""
                  loading="lazy"
                  className="h-10 w-10 shrink-0 border border-gray-200 bg-white object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = PLACEHOLDER_IMG;
                  }}
                />
                <span className="min-w-0">
                  <span className="block truncate">{cleanText(item.name)}</span>
                  {(item.model || item.sku) && (
                    <span className="block text-xs text-gray-500">
                      Code: {item.model || item.sku}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
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
  const [pasteNote, setPasteNote] = useState("");
  const [done, setDone] = useState(null); // { count } after a successful submit
  const [exporting, setExporting] = useState(false);

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
      const payload = buildPayload(values);
      try {
        // A passed-in handler wins, otherwise call the API through the hook
        if (onSubmit) await onSubmit(payload);
        else await createBulkOrder(payload);
        setDone({ count: payload.rows.length });
        toast.success(
          `Bulk order sent for ${payload.rows.length} recipient${
            payload.rows.length > 1 ? "s" : ""
          }.`,
        );
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Could not send the bulk order. Please try again.";
        toast.error(message);
      }
    },
  });

  // Fill name, email and mobile from the profile
  const prefill = (u, onlyEmpty = true) => {
    if (!u) return;
    // Field names depend on the profile API response, adjust if they differ
    const fullName =
      u.name || `${u.firstname || ""} ${u.lastname || ""}`.trim();
    const email = u.email || "";
    const mobile = toPhone10(u.telephone || u.mobile || u.phone || "");

    const c = formik.values.customer;
    // false = skip validation so no error flashes before the user touches anything
    if (fullName && (!onlyEmpty || !c.name)) formik.setFieldValue("customer.name", fullName, false);
    if (email && (!onlyEmpty || !c.email)) formik.setFieldValue("customer.email", email, false);
    if (mobile && (!onlyEmpty || !c.mobile)) formik.setFieldValue("customer.mobile", mobile, false);
  };

  useEffect(() => {
    if (!user || prefilledRef.current) return;
    prefilledRef.current = true;
    prefill(user);
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

    // Single cell paste: let it through, but drop the trailing newline Excel adds
    if (!text.includes("\t") && !/[\r\n]/.test(text.trim())) {
      if (text !== text.trim()) {
        e.preventDefault();
        const path = `rows.${rowIndex}.${colKey}`;
        const current = String(getIn(formik.values, path) ?? "");
        const start = e.target.selectionStart ?? current.length;
        const end = e.target.selectionEnd ?? current.length;
        formik.setFieldValue(path, current.slice(0, start) + text.trim() + current.slice(end));
      }
      return;
    }
    e.preventDefault();

    const grid = parseTSV(text).map((cells) =>
      cells.map((c) => c.replace(/\s*[\r\n]+\s*/g, ", ").trim()),
    );
    const startCol = ROW_FIELDS.indexOf(colKey);
    const next = v.rows.map((r) => ({ ...r }));
    let skipped = 0;

    // SKU / MPN column Excel ke order ka hissa nahi hai, isliye yahan sirf
    // is column ke neeche wali cells bharte hain (har line ki pehli cell)
    if (colKey === "mpn") {
      grid.forEach((cells, li) => {
        const ri = rowIndex + li;
        if (ri >= MAX_ROWS) {
          skipped++;
          return;
        }
        while (next.length <= ri) next.push(emptyRow());
        next[ri].mpn = cells[0] ?? "";
      });
      formik.setFieldValue("rows", next);
      setPasteNote(
        skipped
          ? `Pasted. ${skipped} row(s) were left out because the form allows ${MAX_ROWS} recipients.`
          : "",
      );
      return;
    }

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
    setPasteNote("");
    // resetForm clears the profile fields, so fill them again
    prefill(user, false);
  };

  // Fills bulk-order-form.xlsx (from /public) with the form data and downloads it
  const handleExport = async () => {
    const payload = buildPayload(formik.values);
    if (payload.rows.length === 0) {
      toast.error("Add at least one recipient before exporting.");
      return;
    }

    setExporting(true);
    try {
      // Load ExcelJS only when the button is clicked
      const mod = await import("exceljs/dist/exceljs.min.js");
      const ExcelJS = mod.default ?? mod;

      // Open the template
      const res = await fetch(TEMPLATE.url);
      if (!res.ok) throw new Error("Template file not found.");
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await res.arrayBuffer());
      const sheet = workbook.worksheets[TEMPLATE.sheetIndex];
      if (!sheet) throw new Error("Template sheet missing.");

      // Wider columns so the text is readable
      Object.entries(TEMPLATE.colWidths).forEach(([col, width]) => {
        sheet.getColumn(col).width = width;
      });

      // Logo / image (added again so it always shows in the exported file)
      if (TEMPLATE.logo) {
        try {
          const imgRes = await fetch(TEMPLATE.logo.url);
          if (imgRes.ok) {
            const imageId = workbook.addImage({
              buffer: await imgRes.arrayBuffer(),
              extension: TEMPLATE.logo.extension,
            });
            sheet.addImage(imageId, {
              tl: TEMPLATE.logo.tl,
              ext: TEMPLATE.logo.ext,
            });
          }
        } catch {
          // A missing logo should not stop the export
        }
      }

      // Customer block + instructions
      const c = payload.customer;
      Object.entries(TEMPLATE.customer).forEach(([key, addr]) => {
        sheet.getCell(addr).value = c[key] || "";
      });
      sheet.getCell(TEMPLATE.instructions).value = payload.instructions;

      // Recipients. Rows after the first copy its style (borders, wrap, font)
      const styleRow = sheet.getRow(TEMPLATE.firstRow);
      payload.rows.forEach((r, i) => {
        const rowNo = TEMPLATE.firstRow + i;
        const row = sheet.getRow(rowNo);

        if (i > 0) {
          styleRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            row.getCell(colNumber).style = { ...cell.style };
          });
        }

        Object.entries(TEMPLATE.cols).forEach(([key, col]) => {
          if (!col) return; // template mein is field ka column nahi hai
          const value = key === "srNo" ? r.srNo : r[key];
          const cell = sheet.getCell(`${col}${rowNo}`);
          cell.value = value;
          cell.alignment = {
            ...cell.alignment,
            wrapText: true,
            vertical: "top",
          };
        });
      });

      // Download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = TEMPLATE.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      toast.error(err?.message || "Could not export the Excel file.");
    } finally {
      setExporting(false);
    }
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
        hint={`Up to ${MAX_ROWS} recipients. Empty rows are ignored. You can paste rows copied from Excel.`}
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
                  {COLUMNS.map((col) =>
                    // product column ke liye suggestions (image ke saath) wala cell
                    col.key === "product" ? (
                      <ProductCell
                        key={col.key}
                        formik={formik}
                        index={i}
                        col={col}
                        onPaste={handlePaste}
                      />
                    ) : (
                      <Cell
                        key={col.key}
                        formik={formik}
                        index={i}
                        col={col}
                        onPaste={handlePaste}
                      />
                    ),
                  )}
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
        {formik.submitCount > 0 && !formik.isValid && (
          <p
            role="alert"
            className="mb-3 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            Please fix the highlighted fields.
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={handleExport}
            disabled={busy || exporting}
            className={`${btnOutline} px-6 py-2.5`}
          >
            {exporting ? (
              <TbLoader2 size={16} className="animate-spin" />
            ) : (
              <TbFileSpreadsheet size={16} />
            )}
            {exporting ? "Preparing…" : "Export to Excel"}
          </button>
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