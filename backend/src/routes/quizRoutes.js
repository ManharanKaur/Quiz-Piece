import express from "express";
import {
  getQuizOptions,
  getAnimeQuiz,
  submitQuiz,
} from "../controllers/quizController.js";

const router = express.Router();

router.get("/options", getQuizOptions);

router.get("/anime", getAnimeQuiz);

router.post("/submit", submitQuiz);

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Quiz route is working",
  });
});

export default router;
