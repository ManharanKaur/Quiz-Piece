import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/CreateQuiz.css";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [expiryHours, setExpiryHours] = useState(1);
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      question: "",
      options: [
        { id: 1, text: "" },
        { id: 2, text: "" },
        { id: 3, text: "" },
        { id: 4, text: "" },
      ],
      correctOptionIndex: 0,
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [generatedCode, setGeneratedCode] = useState(null);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        question: "",
        options: [
          { id: 1, text: "" },
          { id: 2, text: "" },
          { id: 3, text: "" },
          { id: 4, text: "" },
        ],
        correctOptionIndex: 0,
      },
    ]);
  };

  const handleRemoveQuestion = (id) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleQuestionChange = (id, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, question: value } : q))
    );
  };

  const handleAddOption = (questionId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptionId = q.options.length ? Math.max(...q.options.map(o => o.id)) + 1 : 1;
          return {
            ...q,
            options: [...q.options, { id: newOptionId, text: "" }],
          };
        }
        return q;
      })
    );
  };

  const handleRemoveOption = (questionId, optionId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          if (q.options.length <= 4) return q; // Min 4 options
          const newOptions = q.options.filter((o) => o.id !== optionId);
          let newCorrectIndex = q.correctOptionIndex;
          if (q.correctOptionIndex >= newOptions.length) {
            newCorrectIndex = newOptions.length - 1;
          }
          return { ...q, options: newOptions, correctOptionIndex: newCorrectIndex };
        }
        return q;
      })
    );
  };

  const handleOptionChange = (questionId, optionId, value) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((o) =>
              o.id === optionId ? { ...o, text: value } : o
            ),
          };
        }
        return q;
      })
    );
  };

  const handleCorrectOptionChange = (questionId, index) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, correctOptionIndex: index } : q
      )
    );
  };

  const validateForm = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        return `Question ${i + 1} cannot be empty.`;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].text.trim()) {
          return `Option ${j + 1} in Question ${i + 1} cannot be empty.`;
        }
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const formattedQuestions = questions.map((q) => {
        // Find the actual option id for the correct answer
        // Note: The CustomQuiz model expects options to be an array of objects with text.
        // It also expects correctOptionId as an ObjectId, but since we are not strictly using ObjectIds for options in the schema,
        // Wait, the schema says: correctOptionId: { type: mongoose.Schema.Types.ObjectId, required: true }
        // For custom quizzes, since we can't easily generate valid ObjectIds on the frontend, let's fix the backend model.
        // Wait! The backend model `customQuestionSchema` has `correctOptionId: { type: mongoose.Schema.Types.ObjectId }`. 
        // But options don't have ObjectIds. I should use correctOptionIndex instead! Or just generate a fake object ID.
        // Actually, if we send a string to the backend, Mongoose will try to cast it to ObjectId.
        // Let's just use 12-byte random hex string for option IDs.
        
        // No, let's format it in a way the backend accepts. If it needs an ObjectId, we will let Mongoose generate the option _id on save.
        // But we need to know the correctOptionId.
        // Wait! I wrote the model `CustomQuiz.js` myself. I should just let the backend handle the saving and give options ObjectIds if it wants.
        // Actually, the `customQuestionSchema` has `options: [optionSchema]`. 
        // If I pass `options: [{ text: "A" }, { text: "B" }]`, Mongoose will add `_id` to each option automatically.
        // BUT how do I set `correctOptionId` if I don't know the generated `_id`?
        // Ah, this is tricky. Instead of `correctOptionId`, the schema should probably just use `correctOptionIndex` like the standard `Question` model!
        
        // I will change the backend model `CustomQuiz.js` shortly to use `correctOptionIndex`. 
        // For now, I will send `correctOptionIndex`.
        return {
          question: q.question,
          options: q.options.map(o => ({ text: o.text })),
          correctOptionIndex: q.correctOptionIndex
        };
      });

      const response = await fetch(`${API_URL}/quiz/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title || "Custom Quiz",
          expiryHours: expiryHours,
          questions: formattedQuestions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create quiz");
      }

      const data = await response.json();
      setGeneratedCode(data.code);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-quiz-page">
      <div className="create-quiz-container">
        <div className="create-quiz-header">
          <h1>Create a Quiz</h1>
          <p>Build your custom quiz and share it with a unique code.</p>
        </div>

        {error && <p className="quiz-error-message" style={{ color: "var(--quiz-danger)", textAlign: "center", marginBottom: "24px" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Quiz Title (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Ultimate Harry Potter Trivia"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Expiry Time (Hours)</label>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <input
                type="range"
                min="1"
                max="24"
                value={expiryHours}
                onChange={(e) => setExpiryHours(e.target.value)}
                style={{ flex: 1 }}
              />
              <span style={{ fontWeight: "bold", fontSize: "1.2rem", width: "60px" }}>{expiryHours} h</span>
            </div>
          </div>

          <div className="questions-section" style={{ marginTop: "40px" }}>
            <h2 style={{ color: "#fff", marginBottom: "20px" }}>Questions</h2>
            
            {questions.map((q, index) => (
              <div key={q.id} className="question-block">
                <div className="question-block-header">
                  <h3>Question {index + 1}</h3>
                  {questions.length > 1 && (
                    <button type="button" className="remove-btn" onClick={() => handleRemoveQuestion(q.id)}>
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Enter your question"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                    required
                  />
                </div>

                <div className="options-list">
                  <label style={{ fontSize: "0.9rem", color: "var(--quiz-muted)" }}>Options (Select the correct one)</label>
                  {q.options.map((opt, optIndex) => (
                    <div key={opt.id} className="option-item">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctOptionIndex === optIndex}
                        onChange={() => handleCorrectOptionChange(q.id, optIndex)}
                      />
                      <input
                        type="text"
                        placeholder={`Option ${optIndex + 1}`}
                        value={opt.text}
                        onChange={(e) => handleOptionChange(q.id, opt.id, e.target.value)}
                        required
                        style={{ flex: 1 }}
                      />
                      {q.options.length > 4 && (
                        <button type="button" className="remove-btn" onClick={() => handleRemoveOption(q.id, opt.id)}>
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button type="button" className="add-btn" onClick={() => handleAddOption(q.id)}>
                    + Add Option
                  </button>
                </div>
              </div>
            ))}

            <button type="button" className="primary-button" style={{ width: "100%", background: "#111", color: "#fff", border: "1px dashed var(--quiz-gold)" }} onClick={handleAddQuestion}>
              + Add Another Question
            </button>
          </div>

          <div className="action-buttons">
            <Link to="/" style={{ textDecoration: "none", flex: 1 }}>
              <button type="button" className="secondary-button" style={{ width: "100%" }}>Cancel</button>
            </Link>
            <button type="submit" className="primary-button" style={{ flex: 1 }} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Quiz"}
            </button>
          </div>
        </form>
      </div>

      {generatedCode && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Success!</h2>
            <p>Your quiz has been created. Share this code with your friends to let them play.</p>
            <div className="code-display">{generatedCode}</div>
            <p style={{ color: "var(--quiz-danger)", fontSize: "0.9rem", marginBottom: "24px" }}>
              This code will expire in {expiryHours} hour{expiryHours > 1 ? "s" : ""}.
            </p>
            <Link to="/">
              <button className="primary-button" style={{ width: "100%" }}>Return to Home</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateQuiz;
