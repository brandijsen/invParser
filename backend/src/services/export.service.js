import xlsx from "xlsx";

const getDocumentUrl = (docId) => {
  const base = process.env.FRONTEND_URL || "";
  return base ? `${base.replace(/\/$/, "")}/documents/${docId}` : "";
};

/**
 * Converte i documenti in formato CSV
 */
export const generateCSV = (documents) => {
  const getVal = (o) => {
    if (o == null) return "";
    if (typeof o === "object" && "value" in o) return o.value ?? "";
    return typeof o === "string" || typeof o === "number" ? String(o) : "";
  };

  const headers = [
    "File Name",
    "Document URL",
    "Invoice Number",
    "Invoice Date",
    "Supplier",
    "Supplier VAT",
    "Uploaded At",
    "Processed At",
    "Document Type",
    "Document Subtype",
    "Currency",
    "Total Amount",
    "Subtotal",
    "VAT Amount",
    "VAT Rate",
    "Withholding Tax Rate",
    "Withholding Tax Amount",
    "Stamp Duty",
    "Net Payable"
  ];

  const rows = documents.map((doc) => {
    const semantic = doc.parsed_json?.semantic || {};
    const amounts = semantic.amounts || {};
    const seller = semantic.seller || {};
    const supplierName =
      doc.supplier_name || getVal(seller.name) || "";
    const supplierVat =
      doc.supplier_vat_number || getVal(seller.vat_number) || "";

    const invoiceNumber = getVal(semantic.invoice_number);
    const invoiceDate = getVal(semantic.invoice_date);

    const currency = getVal(amounts.currency);
    const totalAmount = getVal(amounts.total_amount) || getVal(amounts.net_payable);
    const subtotal = getVal(amounts.subtotal) || getVal(amounts.gross_fee);
    const vatAmount = getVal(amounts.vat?.amount);
    const vatRate = getVal(amounts.vat?.rate);
    const withholdingRate = getVal(amounts.withholding_tax?.rate);
    const withholdingAmount = getVal(amounts.withholding_tax?.amount);
    const stampDuty = getVal(amounts.stamp_duty?.amount);
    const netPayable = getVal(amounts.net_payable);

    return [
      doc.original_name,
      getDocumentUrl(doc.id),
      invoiceNumber,
      invoiceDate,
      supplierName,
      supplierVat,
      new Date(doc.uploaded_at).toLocaleString("en-GB"),
      doc.processed_at ? new Date(doc.processed_at).toLocaleString("en-GB") : "",
      doc.parsed_json?.document_type || "",
      doc.parsed_json?.document_subtype || "",
      currency,
      totalAmount,
      subtotal,
      vatAmount,
      vatRate,
      withholdingRate ? `${withholdingRate}%` : "",
      withholdingAmount,
      stampDuty,
      netPayable
    ];
  });

  // Costruisci CSV manualmente
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
  ].join("\n");

  return csvContent;
};

/**
 * Converte i documenti in formato Excel
 */
export const generateExcel = (documents) => {
  const getVal = (o) => {
    if (o == null) return "";
    if (typeof o === "object" && "value" in o) return o.value ?? "";
    return typeof o === "string" || typeof o === "number" ? String(o) : "";
  };

  const data = documents.map((doc) => {
    const semantic = doc.parsed_json?.semantic || {};
    const amounts = semantic.amounts || {};
    const seller = semantic.seller || {};
    const supplierName =
      doc.supplier_name || getVal(seller.name) || "";
    const supplierVat =
      doc.supplier_vat_number || getVal(seller.vat_number) || "";

    const currency = getVal(amounts.currency);
    const totalAmount = getVal(amounts.total_amount) || getVal(amounts.net_payable);
    const subtotal = getVal(amounts.subtotal) || getVal(amounts.gross_fee);
    const vatAmount = getVal(amounts.vat?.amount);
    const vatRate = getVal(amounts.vat?.rate);
    const withholdingRate = getVal(amounts.withholding_tax?.rate);
    const withholdingAmount = getVal(amounts.withholding_tax?.amount);
    const stampDuty = getVal(amounts.stamp_duty?.amount);
    const netPayable = getVal(amounts.net_payable);

    const invoiceNumber = getVal(semantic.invoice_number);
    const invoiceDate = getVal(semantic.invoice_date);

    return {
      "File Name": doc.original_name,
      "Document URL": getDocumentUrl(doc.id),
      "Invoice Number": invoiceNumber,
      "Invoice Date": invoiceDate,
      Supplier: supplierName,
      "Supplier VAT": supplierVat,
      "Uploaded At": new Date(doc.uploaded_at).toLocaleString("en-GB"),
      "Processed At": doc.processed_at
        ? new Date(doc.processed_at).toLocaleString("en-GB")
        : "",
      "Document Type": doc.parsed_json?.document_type || "",
      "Document Subtype": doc.parsed_json?.document_subtype || "",
      Currency: currency,
      "Total Amount": totalAmount,
      Subtotal: subtotal,
      "VAT Amount": vatAmount,
      "VAT Rate": vatRate ? `${vatRate}%` : "",
      "Withholding Tax Rate": withholdingRate ? `${withholdingRate}%` : "",
      "Withholding Tax Amount": withholdingAmount,
      "Stamp Duty": stampDuty,
      "Net Payable": netPayable
    };
  });

  // Crea workbook
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(data);

  // Colonna "Document URL" = 2a colonna (B) - aggiungi hyperlink cliccabili
  const docUrlCol = "B";
  data.forEach((row, i) => {
    const url = row["Document URL"];
    if (url) {
      const cellRef = `${docUrlCol}${i + 2}`;
      if (ws[cellRef]) ws[cellRef].l = { Target: url, Tooltip: "Apri documento" };
    }
  });

  // Auto-size colonne
  const maxWidth = 50;
  const wscols = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.min(maxWidth, Math.max(key.length + 2, 10))
  }));
  ws["!cols"] = wscols;

  xlsx.utils.book_append_sheet(wb, ws, "Documents");

  // Genera buffer
  const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
  return buffer;
};
