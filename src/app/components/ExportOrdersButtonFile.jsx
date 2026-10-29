"use client";

import { TbFileSpreadsheet } from "react-icons/tb";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/*  Template settings (/public/bulk-order-form.xlsx)                          */
/* -------------------------------------------------------------------------- */

const TEMPLATE = {
  url: "/bulk-order-form.xlsx",
  sheetIndex: 0, // pehli sheet ("Sheet1")
  firstRow: 10, // recipients ki pehli row
  lastRow: 24, // template ki aakhri recipient row (15 rows: 10 se 24)
  instructionsTop: 26, // Instructions block ki pehli row (A26:B27 label, C26:G27 value)
};

const COL_LETTERS = ["A", "B", "C", "D", "E", "F", "G"];

// Recipients ka har field template ke kis column mein jaata hai
const RECIPIENT_COLS = [
  { col: "A", value: (r) => r.srNo },
  { col: "B", value: (r) => r.recipient },
  { col: "C", value: (r) => r.address },
  { col: "D", value: (r) => r.mobile },
  { col: "E", value: (r) => r.product },
  { col: "F", value: (r) => r.message },
  { col: "G", value: (r) => r.remarks },
];

// "Your details" ke cells (merged cells ka pehla cell hi use hota hai)
const CUSTOMER_CELLS = [
  { cell: "C3", value: (p) => p.customer.name },
  { cell: "C4", value: (p) => p.customer.email },
  { cell: "C5", value: (p) => p.customer.mobile },
  { cell: "C6", value: (p) => p.customer.company },
  { cell: "C7", value: (p) => p.customer.billing },
];

const DEFAULT_CLASS =
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap border-0 bg-[#98022e] px-4 py-2 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-[#7a0225] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm";

// Style object ki independent copy (taaki cells ek hi object share na karein)
const cloneStyle = (style) => JSON.parse(JSON.stringify(style || {}));

/**
 * Template mein sirf 15 recipient rows hain. Agar recipients zyada hon,
 * to Instructions block ko `extra` rows neeche khiska do.
 * Naye Instructions value cell ka address return karta hai (jaise "C41").
 */
function moveInstructionsDown(sheet, extra) {
  const oldTop = TEMPLATE.instructionsTop;
  const newTop = oldTop + extra;

  // 1. Purane Instructions block ki styling aur label save karo
  const savedStyles = [];
  [0, 1].forEach((offset) => {
    COL_LETTERS.forEach((col) => {
      savedStyles.push({
        col,
        offset,
        style: cloneStyle(sheet.getCell(`${col}${oldTop + offset}`).style),
      });
    });
  });
  const labelText = sheet.getCell(`A${oldTop}`).value;

  // 2. Merge hatao (warna cells ko likh/saaf nahi kar sakte)
  sheet.unMergeCells(`A${oldTop}:B${oldTop + 1}`);
  sheet.unMergeCells(`C${oldTop}:G${oldTop + 1}`);

  // 3. Purani jagah (row 25 se Instructions ki aakhri row tak) ko normal data row banao
  const dataRowStyles = COL_LETTERS.map((col) =>
    cloneStyle(sheet.getCell(`${col}${TEMPLATE.lastRow}`).style),
  );
  for (let r = TEMPLATE.lastRow + 1; r <= oldTop + 1; r++) {
    COL_LETTERS.forEach((col, ci) => {
      const cell = sheet.getCell(`${col}${r}`);
      cell.value = null;
      cell.style = cloneStyle(dataRowStyles[ci]);
    });
  }

  // 4. Instructions block nayi jagah par banao
  savedStyles.forEach(({ col, offset, style }) => {
    sheet.getCell(`${col}${newTop + offset}`).style = style;
  });
  sheet.getCell(`A${newTop}`).value = labelText;
  sheet.mergeCells(`A${newTop}:B${newTop + 1}`);
  sheet.mergeCells(`C${newTop}:G${newTop + 1}`);

  return `C${newTop}`;
}

/**
 * Props:
 *  - payload: { customer, rows, instructions } (form ka buildPayload() output)
 *  - fileName: download hone wali file ka naam
 *  - disabled: true ho to button band rahega
 *  - className: button ki styling badalne ke liye (optional)
 */
export default function ExportBulkOrderButton({
  payload,
  fileName = "bulk_order.xlsx",
  disabled = false,
  className = DEFAULT_CLASS,
}) {
  const hasRows = Boolean(payload?.rows?.length);

  const handleExport = async () => {
    if (!hasRows) return;

    try {
      // 1. ExcelJS ka browser build
      const ExcelJS = (await import("exceljs/dist/exceljs.min.js")).default;

      // 2. /public se template fetch karke open karo
      const res = await fetch(TEMPLATE.url);
      if (!res.ok) throw new Error("Template file not found.");
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await res.arrayBuffer());
      const sheet = workbook.worksheets[TEMPLATE.sheetIndex];

      // FIX: ExcelJS bug. outlinePr aur pageSetUpPr ka order ulta likhta hai,
      // jisse Excel "sheet1.xml XML error" deta hai. Is setting ki zaroorat nahi.
      delete sheet.properties.outlineProperties;

      // 3. Customer details fill karo
      CUSTOMER_CELLS.forEach(({ cell, value }) => {
        sheet.getCell(cell).value = value(payload);
      });

      // 4. Template ki 15 rows se zyada recipients ho to Instructions neeche khiskao
      const templateRowCount = TEMPLATE.lastRow - TEMPLATE.firstRow + 1; // 15
      const extra = payload.rows.length - templateRowCount;
      let instructionsCell = `C${TEMPLATE.instructionsTop}`;
      if (extra > 0) instructionsCell = moveInstructionsDown(sheet, extra);

      // 5. Har recipient ko ek row mein likho (row 10 se shuru)
      payload.rows.forEach((row, i) => {
        const rowNo = TEMPLATE.firstRow + i;
        RECIPIENT_COLS.forEach(({ col, value }) => {
          const cell = sheet.getCell(`${col}${rowNo}`);
          // Template se bahar ki rows ko aakhri template row jaisi styling do
          if (rowNo > TEMPLATE.lastRow) {
            cell.style = cloneStyle(sheet.getCell(`${col}${TEMPLATE.lastRow}`).style);
          }
          cell.value = value(row);
        });
      });

      // 6. Instructions likho
      sheet.getCell(instructionsCell).value = payload.instructions || "";

      // 7. Filled file download karo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      toast.error(err?.message || "Could not export the Excel file.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={disabled || !hasRows}
      className={className}
    >
      <TbFileSpreadsheet size={16} />
      Export to Excel
    </button>
  );
}