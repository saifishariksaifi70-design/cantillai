
import { Router } from "express";

import { protect } from "../middleware/auth.js";

import { sendMessage } from "../controllers/chatController.js";

const router = Router();

// Send employee message to AI
router.post("/message", protect, sendMessage);

export default router;
