import { SupplierModel } from "../models/supplier.model.js";
import logger from "../utils/logger.js";

/**
 * Extracts seller data from parsed_json.semantic
 */
function extractSellerFromSemantic(semantic) {
  if (!semantic?.seller) return null;

  const s = semantic.seller;
  const getVal = (obj) => {
    if (!obj) return null;
    if (typeof obj === "string") return obj.trim() || null;
    if (obj.value != null && obj.value !== "") return String(obj.value).trim();
    return null;
  };

  const name = getVal(s.name);
  if (!name) return null;

  return {
    name,
    vatNumber: getVal(s.vat_number) || null,
    address: getVal(s.address) || null,
    email: getVal(s.email) || null,
  };
}

/**
 * Saves/updates supplier from extracted data and links to document
 */
export async function upsertSupplierFromDocument(userId, documentId, semantic) {
  const seller = extractSellerFromSemantic(semantic);
  if (!seller || !seller.name) return null;

  try {
    const supplier = await SupplierModel.upsert(userId, seller);
    const { DocumentModel } = await import("../models/document.model.js");
    await DocumentModel.updateSupplierId(documentId, userId, supplier.id);

    logger.info("Supplier upserted from invoice", {
      userId,
      documentId,
      supplierId: supplier.id,
      supplierName: supplier.name,
    });

    return supplier;
  } catch (err) {
    logger.warn("Supplier upsert failed (non-blocking)", {
      userId,
      documentId,
      error: err.message,
    });
    return null;
  }
}
