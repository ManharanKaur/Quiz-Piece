import { useEffect, useState } from "react";
import "../styles/TakeQuiz.css";

// Reads the backend URL from the Vite environment file.
// Example value:
// VITE_API_URL=http://localhost:5000
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function TakeQuiz() {
  // Current visible screen:
  // selection -> choose quiz length
  // quiz      -> answer questions
  // result    -> show score and correct answers
  const [quizStage, setQuizStage] = useState("selection");

  // Quiz-length choices received from the backend.
  const [quizOptions, setQuizOptions] = useState([]);

  // Unique backend-created quiz attempt.
  const [attemptId, setAttemptId] = useState(null);

  // Questions received from the backend.
  // Correct answers are not included here.
  const [quizQuestions, setQuizQuestions] = useState([]);

  const [selectedQuestionCount, setSelectedQuestionCount] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Answers are stored as:
  // {
  //   questionId: optionId
  // }
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Final result returned by the backend.
  const [quizResult, setQuizResult] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  /**
   * Fetch available quiz-length options when the page loads.
   * Because these options come from the backend, adding a new
   * 25-question quiz will not require changing this component.
   */
  useEffect(() => {
    const fetchQuizOptions = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/quiz-options`);

        if (!response.ok) {
          throw new Error("Unable to load quiz options.");
        }

        const data = await response.json();

        setQuizOptions(data.options || []);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizOptions();
  }, []);

  /**
   * Creates a new quiz attempt on the backend.
   *
   * @param {number} questionCount
   * Number of questions selected by the user.
   */
  const startQuiz = async (questionCount) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/quiz-attempts`, {
        method: "POST",

        // Indicates that the request body contains JSON.
        headers: {
          "Content-Type": "application/json",
        },

        // JSON.stringify converts a JavaScript object
        // into JSON before sending it to the backend.
        body: JSON.stringify({
          category: "general-knowledge",
          questionCount,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to start the quiz.");
      }

      const data = await response.json();

      setAttemptId(data.attemptId);
      setQuizQuestions(data.questions || []);
      setSelectedQuestionCount(questionCount);

      // Reset all values from any previous quiz attempt.
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setQuizResult(null);

      setQuizStage("quiz");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Saves the selected option ID for a particular question.
   *
   * @param {number|string} questionId
   * Database ID of the question.
   *
   * @param {number|string} optionId
   * Database ID of the selected option.
   */
  const handleAnswerSelection = (questionId, optionId) => {
    setSelectedAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: optionId,
    }));
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((previousIndex) =>
      Math.min(previousIndex + 1, quizQuestions.length - 1),
    );
  };

  /**
   * Directly opens a question using its array index.
   *
   * @param {number} index
   * Position of the selected question in quizQuestions.
   */
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  /**
   * Sends all selected answers to the backend.
   * The backend checks each answer using the database.
   */
  const submitQuiz = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      // Converts the selectedAnswers object into the array format
      // expected by the backend.
      const answers = Object.entries(selectedAnswers).map(
        ([questionId, optionId]) => ({
          questionId: Number(questionId),
          optionId,
        }),
      );

      const response = await fetch(
        `${API_URL}/api/quiz-attempts/${attemptId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        },
      );

      if (!response.ok) {
        throw new Error("Unable to submit the quiz.");
      }

      const resultData = await response.json();

      setQuizResult(resultData);
      setQuizStage("result");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const restartQuiz = () => {
    startQuiz(selectedQuestionCount);
  };

  const returnToQuizSelection = () => {
    setQuizStage("selection");
    setAttemptId(null);
    setQuizQuestions([]);
    setSelectedAnswers({});
    setQuizResult(null);
    setCurrentQuestionIndex(0);
    setSelectedQuestionCount(null);
    setError("");
  };

  if (isLoading) {
    return (
      <main className="take-quiz-page">
        <div className="quiz-status-card">
          <h2>Loading quiz...</h2>
        </div>
      </main>
    );
  }

  if (quizStage === "selection" && quizOptions.length === 0) {
    return (
      <main className="take-quiz-page">
        <div className="quiz-status-card">
          <h2>No quiz options available</h2>

          <p>{error || "Quiz options have not been configured yet."}</p>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------
  // Quiz-length selection screen
  // -------------------------------------------------------
  if (quizStage === "selection") {
    return (
      <main className="take-quiz-page">
        <section className="quiz-selection">
          <div className="quiz-heading">
            <span className="quiz-label">GENERAL KNOWLEDGE</span>

            <h1>Choose your quiz</h1>

            <p>Select the number of questions you would like to answer.</p>

            {error && <p className="quiz-error-message">{error}</p>}
          </div>

          <div className="quiz-option-grid">
            {quizOptions.map((option) => (
              <button
                key={option.id}
                className="quiz-option-card"
                onClick={() => startQuiz(option.questionCount)}
              >
                <span className="quiz-option-number">
                  {option.questionCount}
                </span>

                <span className="quiz-option-content">
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </span>

                <span className="quiz-option-arrow" aria-hidden="true">
                  →
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];

  // -------------------------------------------------------
  // Quiz-question screen
  // -------------------------------------------------------
  if (quizStage === "quiz" && currentQuestion) {
    const isFirstQuestion = currentQuestionIndex === 0;

    const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

    const answeredQuestionCount = Object.keys(selectedAnswers).length;

    const unansweredQuestionCount =
      quizQuestions.length - answeredQuestionCount;

    return (
      <main className="take-quiz-page">
        <section className="quiz-container">
          <header className="quiz-topbar">
            <div>
              <span className="quiz-label">GENERAL KNOWLEDGE QUIZ</span>

              <h1>
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </h1>
            </div>

            <div className="answered-count">
              {answeredQuestionCount}/{quizQuestions.length} answered
            </div>
          </header>

          <div className="quiz-progress-track">
            <div
              className="quiz-progress-value"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / quizQuestions.length) * 100
                }%`,
              }}
            />
          </div>

          {error && <p className="quiz-error-message">{error}</p>}

          <div className="question-layout">
            <aside className="question-navigation">
              <h2>Questions</h2>

              <div className="question-number-grid">
                {quizQuestions.map((question, index) => {
                  const isAnswered = selectedAnswers[question.id] !== undefined;

                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={question.id}
                      className={[
                        "question-number-button",
                        isAnswered ? "answered" : "",
                        isCurrent ? "current" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => goToQuestion(index)}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </aside>

            <article className="question-card">
              <span className="question-count">
                Question {currentQuestionIndex + 1}
              </span>

              <h2>{currentQuestion.question}</h2>

              <div className="question-options">
                {currentQuestion.options.map((option, optionIndex) => {
                  const isSelected =
                    selectedAnswers[currentQuestion.id] === option.id;

                  return (
                    <label
                      key={option.id}
                      className={`answer-option ${
                        isSelected ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        checked={isSelected}
                        onChange={() =>
                          handleAnswerSelection(currentQuestion.id, option.id)
                        }
                      />

                      <span className="option-letter">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>

                      <span className="option-text">{option.text}</span>
                    </label>
                  );
                })}
              </div>

              <footer className="question-actions">
                <button
                  className="secondary-button"
                  onClick={goToPreviousQuestion}
                  disabled={isFirstQuestion}
                >
                  ← Previous
                </button>

                {!isLastQuestion ? (
                  <button className="primary-button" onClick={goToNextQuestion}>
                    Next →
                  </button>
                ) : (
                  <button
                    className="submit-button"
                    onClick={submitQuiz}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit quiz"}
                  </button>
                )}
              </footer>

              {isLastQuestion && unansweredQuestionCount > 0 && (
                <p className="unanswered-message">
                  You still have {unansweredQuestionCount} unanswered{" "}
                  {unansweredQuestionCount === 1 ? "question" : "questions"}.
                </p>
              )}
            </article>
          </div>
        </section>
      </main>
    );
  }

  // -------------------------------------------------------
  // Final result screen
  // -------------------------------------------------------
  if (quizStage === "result" && quizResult) {
    return (
      <main className="take-quiz-page">
        <section className="result-container">
          <div className="result-summary">
            <span className="quiz-label">QUIZ COMPLETED</span>

            <div className="score-circle">
              <strong>{quizResult.percentage}%</strong>
              <span>Your score</span>
            </div>

            <h1>
              You answered {quizResult.score} out of {quizResult.totalQuestions}{" "}
              correctly
            </h1>

            <div className="result-actions">
              <button className="primary-button" onClick={restartQuiz}>
                Try another {selectedQuestionCount}-question quiz
              </button>

              <button
                className="secondary-button"
                onClick={returnToQuizSelection}
              >
                Change quiz length
              </button>
            </div>
          </div>

          <div className="answer-review">
            <div className="review-heading">
              <h2>Answer review</h2>

              <span>{quizResult.totalQuestions} questions</span>
            </div>

            {quizResult.results.map((result, index) => {
              const question = quizQuestions.find(
                (item) => item.id === result.questionId,
              );

              return (
                <article
                  key={result.questionId}
                  className={`review-card ${
                    result.isCorrect ? "correct-review" : "incorrect-review"
                  }`}
                >
                  <div className="review-question-header">
                    <span>Question {index + 1}</span>

                    <strong>
                      {result.isCorrect ? "Correct" : "Incorrect"}
                    </strong>
                  </div>

                  <h3>{question?.question || "Question"}</h3>

                  <div className="review-answer-row">
                    <span>Your answer</span>

                    <p>{result.selectedAnswer || "Not answered"}</p>
                  </div>

                  <div className="review-answer-row correct-answer-row">
                    <span>Correct answer</span>

                    <p>{result.correctAnswer}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    );
  }

  return null;
}

export default TakeQuiz;
