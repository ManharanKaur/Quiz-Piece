import express from "express";
import {
  getQuizByCategory,
  submitQuiz,
  createCustomQuiz,
  getCustomQuizByCode
} from "../controllers/quizController.js";

const router = express.Router();

router.post("/submit", submitQuiz);
router.post("/create", createCustomQuiz);
router.get("/code/:code", getCustomQuizByCode);
router.get("/category/:category", getQuizByCategory);

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Quiz route is working",
  });
});

export default router;
