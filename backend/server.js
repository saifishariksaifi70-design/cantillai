
import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import policyRoutes from "./routes/policyRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import csvRoutes from "./routes/csvRoutes.js";

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://cantillai.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/csv", csvRoutes);

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "Cantill.ai Backend Running Successfully!"
  });
});

// Server Start
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Server Startup Error:", error.message);
    process.exit(1);
  }
}

startServer();
