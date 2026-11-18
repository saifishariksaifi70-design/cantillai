
import { Router } from "express";

import { register, login, me} from "../controllers/authController.js";

import { protect } from "../middleware/auth.js";

const router = Router();

// Register Employee
router.post("/register", register);

// Login Employee / Admin
router.post("/login", login);

// Get logged-in user's profile
router.get("/me", protect, me);

export default router;
