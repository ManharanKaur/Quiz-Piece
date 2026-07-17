import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: true }
);

const customQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [optionSchema],
      required: true,
      validate: {
        validator: function (options) {
          return options.length >= 4;
        },
        message: "A question must have at least 4 options",
      },
    },
    correctOptionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { _id: true }
);

const customQuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Custom Quiz",
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 6,
      maxlength: 6,
    },
    questions: {
      type: [customQuestionSchema],
      required: true,
      validate: {
        validator: function (questions) {
          return questions.length >= 1;
        },
        message: "A quiz must have at least 1 question",
      },
    },
    expiresAt: {
      type: Date,
      required: true,
      // TTL index: MongoDB will automatically delete documents where expiresAt is older than current time
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const CustomQuiz =
  mongoose.models.CustomQuiz || mongoose.model("CustomQuiz", customQuizSchema);

export default CustomQuiz;
