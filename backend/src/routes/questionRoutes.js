import express from "express";
import Question from "../models/Question.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const category = req.query.category;

    const pipeline = [];

    if (category) {
      pipeline.push({
        $match: {
          category: category,
        },
      });
    }

    pipeline.push({
      $sample: {
        size: limit,
      },
    });

    const questions = await Question.aggregate(pipeline);

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch questions from database.",
    });
  }
});

export default router;
