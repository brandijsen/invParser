import { SupplierModel } from "../models/supplier.model.js";
import { logError } from "../utils/logger.js";

/**
 * Verifica che supplierId esista e appartenga all'utente
 */
async function getSupplierOr404(supplierId, userId) {
  const parsed = parseInt(supplierId, 10);
  if (isNaN(parsed)) return null;
  const supplier = await SupplierModel.findById(parsed, userId);
  if (!supplier) return null;
  return supplier;
}

/**
 * GET /api/suppliers?search=xxx
 * Lists user's suppliers, with optional search
 */
export const listSuppliers = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const search = String(req.query.search || "").trim();
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 500);
    const suppliers = await SupplierModel.findByUser(req.user.id, { search, limit });
    res.json({ suppliers });
  } catch (err) {
    logError(err, { operation: "listSuppliers", userId: req.user?.id });
    let message = "Failed to list suppliers";
    if (err.code === "ER_NO_SUCH_TABLE") {
      message = "Suppliers table not found. Run: mysql -u root -p invParserDb < backend/migrations/db.sql";
    } else if (process.env.NODE_ENV !== "production") {
      message = err.message || message;
    }
    res.status(500).json({ message });
  }
};

/**
 * GET /api/suppliers/:id
 * Get a single supplier by ID
 */
export const getSupplier = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const supplierId = req.params.id;
    const supplier = await getSupplierOr404(supplierId, req.user.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json({ supplier });
  } catch (err) {
    logError(err, { operation: "getSupplier", userId: req.user?.id, supplierId: req.params?.id });
    res.status(500).json({ message: err.message || "Failed to get supplier" });
  }
};
