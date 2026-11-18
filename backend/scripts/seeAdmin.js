
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password || password.length < 12) {
      throw new Error(
        "Set ADMIN_EMAIL and strong ADMIN_PASSWORD in .env"
      );
    }

    const existing = await User.findOne({ email });

    if (existing) {
      if (existing.role !== "admin") {
        throw new Error(
          "This email already belongs to a non-admin user."
        );
      }

      console.log("Admin already exists.");
      return;
    }

    await User.create({
      name: process.env.ADMIN_NAME || "Admin",
      email,
      password: await bcrypt.hash(password, 12),
      role: "admin"
    });

    console.log("Admin created successfully.");

  } catch (error) {
    console.error("Seed Admin Error:", error.message);
    process.exitCode = 1;

  } finally {
    await mongoose.disconnect();
  }
}

seed();
