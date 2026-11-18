
import { Router } from "express";

import { protect, adminOnly } from "../middleware/auth.js";

import { listPolicies, createPolicy, publishPolicy } from "../controllers/policyController.js";

const router = Router();

// All routes require Admin authentication
router.use(protect, adminOnly);

// Get all policies
router.get("/", listPolicies);

// Create new policy
router.post("/", createPolicy);

// Publish policy
router.post("/:id/publish", publishPolicy);

export default router;
