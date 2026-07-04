import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import connectDB from "./src/config/db.js";
import quizRoutes from "./src/routes/quizRoutes.js";
import questionRoutes from "./src/routes/questionRoutes.js";
import Question from "./src/models/Question.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Quiz App Backend is running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/quiz", quizRoutes);

app.use("/api/questions", questionRoutes);

app.get("/api/debug-questions", async (req, res, next) => {
  try {
    const databaseName = mongoose.connection.name;

    const modelCollectionName = Question.collection.name;

    const mongooseCount = await Question.countDocuments();

    const nativeCount = await mongoose.connection.db
      .collection("questions")
      .countDocuments();

    const sampleDocs = await mongoose.connection.db
      .collection("questions")
      .find({})
      .limit(3)
      .toArray();

    res.json({
      success: true,
      databaseName,
      modelCollectionName,
      mongooseCount,
      nativeCount,
      sampleDocs,
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Backend Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
