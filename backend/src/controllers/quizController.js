import mongoose from "mongoose";
import Question from "../Models//Question.js";

const asyncHandler = (controllerFunction) => {
  return (req, res, next) => {
    Promise.resolve(controllerFunction(req, res, next)).catch(next);
  };
};

const buildQuizFilter = ({ category = "anime", franchise }) => {
  const filter = {
    category,
    isActive: true,
  };

  if (franchise) {
    filter.franchise = franchise;
  }

  return filter;
};

export const getQuizOptions = asyncHandler(async (req, res) => {
  const category = req.query.category || "anime";
  const franchise = req.query.franchise;

  const filter = buildQuizFilter({ category, franchise });

  const totalQuestions = await Question.countDocuments(filter);

  const allowedCounts = [10, 20].filter((count) => totalQuestions >= count);

  res.json({
    success: true,
    category,
    franchise: franchise || "mixed",
    totalQuestions,
    allowedCounts,
  });
});

export const getAnimeQuiz = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const franchise = req.query.franchise;

  const allowedLimits = [10, 20];

  if (!allowedLimits.includes(limit)) {
    res.status(400);
    throw new Error("Quiz limit must be either 10 or 20");
  }

  const filter = buildQuizFilter({
    category: "anime",
    franchise,
  });

  const totalQuestions = await Question.countDocuments(filter);

  if (totalQuestions < limit) {
    res.status(400);
    throw new Error(
      `Only ${totalQuestions} questions available. Add more questions to database.`,
    );
  }

  const questions = await Question.aggregate([
    {
      $match: filter,
    },
    {
      $sample: {
        size: limit,
      },
    },
    {
      $project: {
        correctOptionIndex: 0,
        explanation: 0,
        __v: 0,
        isActive: 0,
      },
    },
  ]);

  res.json({
    success: true,
    quiz: {
      category: "anime",
      franchise: franchise || "mixed",
      totalQuestions: questions.length,
      questions,
    },
  });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    res.status(400);
    throw new Error("Answers array is required");
  }

  for (const answer of answers) {
    if (!mongoose.Types.ObjectId.isValid(answer.questionId)) {
      res.status(400);
      throw new Error("Invalid question ID found");
    }

    if (
      typeof answer.selectedOptionIndex !== "number" ||
      answer.selectedOptionIndex < 0
    ) {
      res.status(400);
      throw new Error("selectedOptionIndex must be a valid number");
    }
  }

  const questionIds = answers.map((answer) => answer.questionId);

  const questions = await Question.find({
    _id: { $in: questionIds },
  }).select("+correctOptionIndex");

  const questionMap = new Map();

  questions.forEach((question) => {
    questionMap.set(question._id.toString(), question);
  });

  let score = 0;

  const resultDetails = answers.map((answer) => {
    const question = questionMap.get(answer.questionId);

    if (!question) {
      return {
        questionId: answer.questionId,
        isCorrect: false,
        message: "Question not found",
      };
    }

    const isCorrect =
      answer.selectedOptionIndex === question.correctOptionIndex;

    if (isCorrect) {
      score += 1;
    }

    return {
      questionId: question._id,
      question: question.question,
      selectedOptionIndex: answer.selectedOptionIndex,
      selectedAnswer:
        question.options[answer.selectedOptionIndex]?.text || "Not answered",
      correctOptionIndex: question.correctOptionIndex,
      correctAnswer: question.options[question.correctOptionIndex].text,
      isCorrect,
      explanation: question.explanation,
    };
  });

  res.json({
    success: true,
    result: {
      totalQuestions: answers.length,
      score,
      wrongAnswers: answers.length - score,
      percentage: Math.round((score / answers.length) * 100),
      details: resultDetails,
    },
  });
});
