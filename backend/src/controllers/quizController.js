import mongoose from "mongoose";
import Question from "../models/Question.js";
import CustomQuiz from "../models/CustomQuiz.js";
import crypto from "crypto";

const asyncHandler = (controllerFunction) => {
  return (req, res, next) => {
    Promise.resolve(controllerFunction(req, res, next)).catch(next);
  };
};

export const getQuizByCategory = asyncHandler(async (req, res) => {
  const category = req.params.category || "anime";
  const limit = 10;

  const filter = {
    category: category,
    isActive: true,
  };

  const totalQuestions = await Question.countDocuments(filter);

  if (totalQuestions < limit) {
    res.status(400);
    throw new Error(
      `Only ${totalQuestions} questions available for category ${category}. Add more questions to database.`
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
      category: category,
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

const generateCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

export const createCustomQuiz = asyncHandler(async (req, res) => {
  const { title, questions, expiryHours } = req.body;

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    res.status(400);
    throw new Error("Questions array is required");
  }

  const hours = parseFloat(expiryHours) || 1;
  if (hours <= 0 || hours > 24) {
    res.status(400);
    throw new Error("Expiry hours must be between 0 and 24");
  }

  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
  
  let code = generateCode();
  let codeExists = await CustomQuiz.findOne({ code });
  while (codeExists) {
    code = generateCode();
    codeExists = await CustomQuiz.findOne({ code });
  }

  const newQuiz = await CustomQuiz.create({
    title,
    code,
    questions,
    expiresAt,
  });

  res.status(201).json({
    success: true,
    code: newQuiz.code,
    expiresAt: newQuiz.expiresAt,
  });
});

export const getCustomQuizByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;

  if (!code) {
    res.status(400);
    throw new Error("Quiz code is required");
  }

  const quiz = await CustomQuiz.findOne({ code: code.toUpperCase() });

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found or has expired");
  }

  if (quiz.expiresAt < new Date()) {
    res.status(404);
    throw new Error("This quiz has expired");
  }

  // Remove the correctOptionId from the response to prevent cheating
  const safeQuestions = quiz.questions.map(q => {
    const { correctOptionId, ...rest } = q.toObject();
    return rest;
  });

  res.json({
    success: true,
    quiz: {
      _id: quiz._id,
      title: quiz.title,
      code: quiz.code,
      totalQuestions: safeQuestions.length,
      questions: safeQuestions,
      expiresAt: quiz.expiresAt,
    },
  });
});
