
import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.js";

import {
  myRequests,
  myOrders,
  allRequests,
  dashboard,
  listOrders,
  listSourcing,
  listDecisions,
  approveRequest,
  rejectRequest,
} from "../controllers/requestController.js";

const router = Router();

// Employee Routes
router.get("/mine", protect, myRequests);
router.get("/my-orders", protect, myOrders);

// Admin Routes
router.get("/", protect, adminOnly, allRequests);
router.get("/dashboard", protect, adminOnly, dashboard);
router.get("/orders", protect, adminOnly, listOrders);
router.get("/sourcing", protect, adminOnly, listSourcing);
router.get("/decisions", protect, adminOnly, listDecisions);

router.patch("/:id/approve", protect, adminOnly, approveRequest);
router.patch("/:id/reject", protect, adminOnly, rejectRequest);

export default router;
