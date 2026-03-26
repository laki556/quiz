import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {verifyAdmin} from "./middleware/auth.js";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// ======================
// MongoDB Connection
// ======================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.log("Retrying in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// ======================
// Schema
// ======================
const responseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  responses: { type: Object, required: true },       // form1 + form2 + form3
  answerType: { type: String },
  trainingInterest: { type: String },
  score: { type: Number },                           // optional
  timeSpent: { type: Object },                       // { form1: ms, form2: ms, form3: ms }
  totalTime: { type: Number },                       // sum of all forms
  audioCount: { type: Object },                      // number of audio plays per audio
  createdAt: { type: Date, default: Date.now },
});

const Response = mongoose.model("Response", responseSchema);

const adminSchema = new mongoose.Schema({
  pin: { type: String, required: true },
});

const Admin = mongoose.model("Admin", adminSchema);

// ======================
// Create admin PIN
// ======================
// const createAdmin = async () => {
//   const hashedPin = await bcrypt.hash("0000", 10);
//
//   await Admin.create({
//     pin: hashedPin,
//   });
//
//   console.log("Admin created with hashed PIN");
// };
//
// createAdmin();

app.post("/api/admin/login", async (req, res) => {
  const { pin } = req.body;

  const admin = await Admin.findOne();

  const isMatch = await bcrypt.compare(pin, admin.pin);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid PIN" });
  }

  // create token
  const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
  );

  res.json({ success: true, token });
});

// ======================
// API: Submit Quiz
// ======================
app.post("/api/submit", async (req, res) => {
  try {
    const { name, responses, answerType, trainingInterest, score, timeSpent, audioCount } = req.body;

    if (!name || !responses) {
      return res.status(400).json({ message: "Name and responses are required." });
    }

    // Calculate total time automatically
    const totalTime = Object.values(timeSpent || {}).reduce((sum, val) => sum + (val || 0), 0);

    const newResponse = new Response({
      name,
      responses,
      answerType,
      trainingInterest,
      score,
      timeSpent,
      totalTime,
      audioCount,
    });

    await newResponse.save();

    res.json({ message: "Responses saved successfully!", totalTime, score });
  } catch (error) {
    console.error("Error saving response:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// API: Get All Responses (optional, for admin/testing)
// ======================
app.get("/api/responses", verifyAdmin, async (req, res) => {
  const allResponses = await Response.find().sort({ createdAt: -1 });
  res.json(allResponses);
});

// ======================
// API: Get Single Response
// ======================
app.get("/api/responses/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await Response.findById(id);

    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }

    res.json(response);
  } catch (err) {
    console.error("Error fetching single response:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ message: "PIN required" });
    }

    const admin = await Admin.findOne();

    if (!admin || admin.pin !== pin) {
      return res.status(401).json({ message: "Invalid PIN" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// Server Start
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));