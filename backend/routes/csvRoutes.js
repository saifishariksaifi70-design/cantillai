import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { uploadCSV } from "../controllers/csvController.js";

const router = Router();

router.post("/upload", protect, adminOnly, upload.single("file"), uploadCSV);

export default router;