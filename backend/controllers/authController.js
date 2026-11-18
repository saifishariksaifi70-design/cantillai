
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT token
const tokenFor = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

// Register user
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "Name, valid email and 8+ character password required."
      });
    }

    const normalized = email.trim().toLowerCase();

    if (await User.findOne({ email: normalized })) {
      return res.status(409).json({
        message: "Email already registered."
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalized,
      password: await bcrypt.hash(password, 12),
      role: "employee"
    });

    return res.status(201).json({
      token: tokenFor(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (e) {
    console.error("Registration Error:", e.message);

    return res.status(500).json({
      message: "Registration failed."
    });
  }
}

// Login user
export async function login(req, res) {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = req.body.password || "";

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid credentials."
      });
    }

    return res.json({
      token: tokenFor(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (e) {
    console.error("Login Error:", e.message);

    return res.status(500).json({
      message: "Login failed."
    });
  }
}

// Get current logged-in user
export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("name email role");

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    return res.json({ user });

  } catch (e) {
    console.error("Profile Error:", e.message);

    return res.status(500).json({
      message: "Failed to fetch user profile."
    });
  }
}
