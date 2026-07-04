import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const questionSchema = new mongoose.Schema(
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
          return options.length >= 2;
        },
        message: "A question must have at least 2 options",
      },
    },

    correctOptionIndex: {
      type: Number,
      required: true,
      min: 0,
      select: false,

      validate: {
        validator: function (value) {
          return value < this.options.length;
        },
        message: "Correct option index is out of range",
      },
    },

    category: {
      type: String,
      default: "anime",
      trim: true,
      lowercase: true,
    },

    franchise: {
      type: String,
      default: "mixed",
      trim: true,
      lowercase: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    explanation: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
