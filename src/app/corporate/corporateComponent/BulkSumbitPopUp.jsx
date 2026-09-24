"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import { FiX, FiUpload, FiFile, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useBulkOrder } from "@/app/api/hooks/useContact";

const ACCENT_HOVER = "#7e1a3c";
const ACCENT = "#98022"
export default function BulkSubmitPopUp({ open, onClose }) {
  // ---------- State ----------
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [parseStatus, setParseStatus] = useState(null); // "success" | "empty" | "error" | null
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const readerRef = useRef(null); // track active FileReader to avoid stale reads
  const isMountedRef = useRef(true);

  // Step 1: mutation hook — handles the actual API call, loading state, toasts
  const { mutate: submitBulkOrder, isPending: submitting } = useBulkOrder();

  // ---------- Mount tracking ----------
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (readerRef.current) {
        try {
          readerRef.current.abort();
        } catch (_) {}
        readerRef.current = null;
      }
    };
  }, []);

  // ---------- Escape key + body scroll lock ----------
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ---------- Helpers ----------
  const resetState = () => {
    setFormData({ name: "", email: "", mobile: "" });
    setSelectedFile(null);
    setFileName("");
    setParseStatus(null);
    setErrors({});
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    if (readerRef.current) {
      try {
        readerRef.current.abort();
      } catch (_) {}
      readerRef.current = null;
    }
    resetState();
    onClose?.();
  };

  // Normalize a label cell: trim, lowercase, strip trailing ":" or "*"
  const normalize = (s) =>
    String(s ?? "")
      .trim()
      .toLowerCase()
      .replace(/[:*]+$/, "")
      .trim();

  // ---------- File parsing ----------
  const parseFile = useCallback((file) => {
    if (!file) return;

    const validExt = /\.(xlsx|xls)$/i.test(file.name);
    if (!validExt) {
      setFileName(file.name);
      setSelectedFile(null);
      setParseStatus("error");
      setErrors((prev) => ({ ...prev, file: "" }));
      return;
    }

    // Step 2: keep the raw File object — this is what actually gets uploaded
    setSelectedFile(file);
    setFileName(file.name);
    setParseStatus(null);

    // abort any previous in-flight read
    if (readerRef.current) {
      try {
        readerRef.current.abort();
      } catch (_) {}
    }

    const reader = new FileReader();
    readerRef.current = reader;

    reader.onload = (evt) => {
      // ignore stale readers
      if (readerRef.current !== reader) return;
      if (!isMountedRef.current) return;

      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // 2D array so we can scan by label text, not hardcoded cell refs
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

        // Exact match (not "includes") so a long title row like
        // "Bulk Order Form (E-Mail - contact@...)" never gets mistaken
        // for the actual "E-Mail ID" field row.
        const findValueByLabel = (candidates) => {
          for (const row of rows) {
            const label = normalize(row[0]);
            if (candidates.includes(label)) {
              const value = row.slice(1).find((c) => String(c ?? "").trim() !== "");
              return value ? String(value).trim() : "";
            }
          }
          return "";
        };

        const name = findValueByLabel(["name"]);
        const email = findValueByLabel(["e-mail id", "email id", "e-mail", "email"]);
        const mobile = findValueByLabel(["mobile no.", "mobile no", "mobile"]);

        setFormData({ name, email, mobile });

        if (!name && !email && !mobile) {
          setParseStatus("empty");
        } else {
          setParseStatus("success");
        }
        setErrors((prev) => ({ ...prev, file: "" }));
      } catch (err) {
        console.error("Failed to parse sheet:", err);
        if (isMountedRef.current) setParseStatus("error");
      } finally {
        if (readerRef.current === reader) readerRef.current = null;
      }
    };

    reader.onerror = () => {
      if (readerRef.current !== reader) return;
      if (!isMountedRef.current) return;
      setParseStatus("error");
      readerRef.current = null;
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    parseFile(file);
  };

  // ---------- Drag & drop ----------
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        parseFile(file);
        // keep the hidden input in sync
        if (fileInputRef.current) {
          const dt = new DataTransfer();
          dt.items.add(file);
          fileInputRef.current.files = dt.files;
        }
      }
    },
    [parseFile]
  );

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ---------- Validation ----------
  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = "Name is required";

    if (!formData.email.trim()) next.email = "E-mail is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) next.email = "Enter a valid e-mail";

    if (!formData.mobile.trim()) next.mobile = "Mobile number is required";
    else if (!/^[+\d][\d\s\-()]{6,}$/.test(formData.mobile.trim()))
      next.mobile = "Enter a valid mobile number";

    if (!selectedFile) next.file = "Please upload the filled bulk order sheet";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ---------- Submit ----------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Step 3: build the multipart payload — field names must match the
    // backend route (`bulkOrderFile`, `name`, `email`, `mobile_no`)
    const payload = new FormData();
    payload.append("bulkOrderFile", selectedFile);
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("mobile_no", formData.mobile);

    submitBulkOrder(payload, {
      onSuccess: () => {
        if (!isMountedRef.current) return;
        handleClose();
      },
      // onError already shows a toast inside useBulkOrder — nothing extra
      // needed here, but the popup stays open so the user can retry.
    });
  };

  // ---------- Early return AFTER all hooks ----------
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-order-title"
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4 font-hind-madurai"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-[520px] rounded-sm shadow-xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10"
          style={{ borderColor: "#eee" }}
        >
          <h3 id="bulk-order-title" className="text-lg font-bold" style={{ color: ACCENT }}>
            Submit Bulk Order Form
          </h3>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5" noValidate>
          {/* File upload — click or drag & drop */}
          <div>
            <label className="text-xs font-semibold block mb-1.5">
              Upload Filled Bulk Order Sheet <span style={{ color: ACCENT }}>*</span>
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-sm py-7 px-4 cursor-pointer transition-colors"
              style={{
                borderColor: isDragging ? ACCENT : errors.file ? "#d9534f" : "#d9d9d9",
                backgroundColor: isDragging ? "#faf5f6" : "transparent",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              {fileName ? (
                <>
                  <FiFile size={26} style={{ color: ACCENT }} />
                  <span className="text-sm text-[#333] text-center break-all">{fileName}</span>
                  <span className="text-[11px] text-gray-400">Click or drop to replace</span>
                </>
              ) : (
                <>
                  <FiUpload
                    size={26}
                    className={isDragging ? "" : "text-gray-400"}
                    style={isDragging ? { color: ACCENT } : {}}
                  />
                  <span className="text-sm text-gray-500">
                    {isDragging
                      ? "Drop the file here"
                      : "Click to upload or drag & drop .xlsx file"}
                  </span>
                </>
              )}
            </div>

            {parseStatus === "success" && (
              <p className="flex items-center gap-1.5 text-xs text-green-600 mt-2">
                <FiCheckCircle size={14} /> Details fetched from sheet — please verify below.
              </p>
            )}
            {parseStatus === "empty" && (
              <p className="flex items-center gap-1.5 text-xs text-amber-600 mt-2">
                <FiAlertCircle size={14} /> No Name/Email/Mobile found in this sheet — it looks
                like the template wasn't filled in. Please enter details manually below.
              </p>
            )}
            {parseStatus === "error" && (
              <p className="flex items-center gap-1.5 text-xs text-red-600 mt-2">
                <FiAlertCircle size={14} /> Could not read this file. Please upload a valid
                .xlsx/.xls sheet.
              </p>
            )}
            {errors.file && <p className="text-xs text-red-600 mt-2">{errors.file}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold block mb-1.5">
              Name <span style={{ color: ACCENT }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFieldChange}
              placeholder="Auto-fetched from sheet"
              className="w-full px-3 py-2.5 text-sm border rounded-[3px] outline-none focus:ring-1"
              style={{ borderColor: errors.name ? "#d9534f" : "#d9d9d9" }}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold block mb-1.5">
              E-Mail ID <span style={{ color: ACCENT }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFieldChange}
              placeholder="Auto-fetched from sheet"
              className="w-full px-3 py-2.5 text-sm border rounded-[3px] outline-none focus:ring-1"
              style={{ borderColor: errors.email ? "#d9534f" : "#d9d9d9" }}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Mobile */}
          <div>
            <label className="text-xs font-semibold block mb-1.5">
              Mobile No. <span style={{ color: ACCENT }}>*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleFieldChange}
              placeholder="Auto-fetched from sheet"
              className="w-full px-3 py-2.5 text-sm border rounded-[3px] outline-none focus:ring-1"
              style={{ borderColor: errors.mobile ? "#d9534f" : "#d9d9d9" }}
            />
            {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#98022e] text-white py-3.5 font-semibold text-sm tracking-wide transition-colors cursor-pointer disabled:opacity-60 hover:bg-[#56031c]"
         
           
          >
            {submitting ? "Submitting..." : "Submit Order"}
          </button>
        </form>
      </div>
    </div>
  );
}