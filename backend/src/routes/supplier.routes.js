import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { listSuppliers, getSupplier } from "../controllers/supplier.controller.js";

const router = Router();

// Read-only: suppliers are created automatically from documents
router.get("/", protect, listSuppliers);
router.get("/:id", protect, getSupplier);

export default router;
