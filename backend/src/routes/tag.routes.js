import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { listTags } from "../controllers/tag.controller.js";

const router = Router();

// Read-only: tags are system-managed, user cannot create/modify them
router.get("/", protect, listTags);

export default router;
