import { useEffect, useMemo, useState } from "react";
import QuizCard from "../components/QuizCard";
import "../styles/TakeQuiz.css";

// This uses your deployed backend if SERVER_URL exists.
// Otherwise it uses your local backend.
const API_URL = import.meta.env.SERVER_URL || "http://localhost:5000";

// These are only UI options.
// Questions are NOT stored here.
// Actual questions will come from MongoDB through backend.
const FALLBACK_QUIZ_OPTIONS = [
  {
    id: "gk-5",
    questionCount: 5,
    title: "5 Questions",
    description: "Quick GK practice quiz.",
  },
  {
    id: "gk-10",
    questionCount: 10,
    title: "10 Questions",
    description: "Balanced GK practice quiz.",
  },
  {
    id: "gk-15",
    questionCount: 15,
    title: "15 Questions",
    description: "Medium length GK quiz.",
  },
  {
    id: "gk-20",
    questionCount: 20,
    title: "20 Questions",
    description: "Full GK practice round.",
  },
];

function TakeQuiz() {
  const [pageMode, setPageMode] = useState("menu");
  const [quizStage, setQuizStage] = useState("selection");

  const [quizCode, setQuizCode] = useState("");
  const [quizOptions, setQuizOptions] = useState(FALLBACK_QUIZ_OPTIONS);

  const [attemptId, setAttemptId] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isStartingQuiz, setIsStartingQuiz] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizOptions = async () => {
      try {
        setIsLoadingOptions(true);

        const response = await fetch(`${API_URL}/api/quiz-options`);

        if (!response.ok) {
          throw new Error("Quiz options route not found.");
        }

        const data = await response.json();

        if (Array.isArray(data.options) && data.options.length > 0) {
          setQuizOptions(data.options);
        }
      } catch (requestError) {
        // This fallback is okay because these are only quiz length cards.
        // Actual questions are still fetched from backend only.
        console.warn("Using fallback quiz options:", requestError.message);
        setQuizOptions(FALLBACK_QUIZ_OPTIONS);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchQuizOptions();
  }, []);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const answeredQuestionCount = useMemo(() => {
    return Object.keys(selectedAnswers).length;
  }, [selectedAnswers]);

  const unansweredQuestionCount = quizQuestions.length - answeredQuestionCount;

  const resetQuizState = () => {
    setAttemptId(null);
    setQuizQuestions([]);
    setSelectedQuestionCount(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizResult(null);
    setError("");
    setQuizStage("selection");
  };

  const goBackToMainMenu = () => {
    resetQuizState();
    setPageMode("menu");
    setQuizCode("");
  };

  const goToGKSelection = () => {
    resetQuizState();
    setPageMode("gk");
  };

  const goToCodeSelection = () => {
    resetQuizState();
    setPageMode("code");
  };

  const extractQuestionsFromResponse = (data) => {
    // This supports multiple possible backend response formats:
    // 1. { questions: [...] }
    // 2. { data: [...] }
    // 3. { quiz: { questions: [...] } }
    // 4. Direct array [...]
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.questions)) return data.questions;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.quiz?.questions)) return data.quiz.questions;
    if (Array.isArray(data.quizQuestions)) return data.quizQuestions;

    return [];
  };

  const normalizeQuestionOptions = (question) => {
    // Case 1: backend sends options as an array.
    // Example:
    // options: ["Delhi", "Mumbai", "Kolkata", "Chennai"]
    // OR
    // options: [{ id: "a", text: "Delhi" }]
    if (Array.isArray(question.options)) {
      return question.options.map((option, optionIndex) => {
        if (typeof option === "string") {
          return {
            id: String(optionIndex),
            text: option,
          };
        }

        return {
          id: String(
            option.id ??
              option._id ??
              option.optionId ??
              option.key ??
              optionIndex,
          ),
          text: String(
            option.text ??
              option.label ??
              option.value ??
              option.option ??
              option.answer ??
              "",
          ),
        };
      });
    }

    // Case 2: backend sends options as separate fields.
    // Example:
    // optionA, optionB, optionC, optionD
    const possibleOptionFields = [
      question.optionA,
      question.optionB,
      question.optionC,
      question.optionD,
    ];

    return possibleOptionFields
      .filter((option) => option !== undefined && option !== null)
      .map((option, optionIndex) => ({
        id: String(optionIndex),
        text: String(option),
      }));
  };

  const resolveCorrectOptionId = (question, normalizedOptions) => {
    // This supports different backend field names for correct answer.
    const rawCorrectAnswer =
      question.correctOptionId ??
      question.correctOptionIndex ??
      question.correctOption ??
      question.correctAnswerIndex ??
      question.correctAnswerId ??
      question.correctAnswer ??
      question.answer ??
      question.answerId ??
      null;

    if (rawCorrectAnswer === null || rawCorrectAnswer === undefined) {
      return null;
    }

    const correctAnswerString = String(rawCorrectAnswer);

    // Case 1: backend correct answer is already option id.
    const optionMatchedById = normalizedOptions.find((option) => {
      return String(option.id) === correctAnswerString;
    });

    if (optionMatchedById) {
      return optionMatchedById.id;
    }

    // Case 2: backend correct answer is option text.
    const optionMatchedByText = normalizedOptions.find((option) => {
      return (
        option.text.trim().toLowerCase() ===
        correctAnswerString.trim().toLowerCase()
      );
    });

    if (optionMatchedByText) {
      return optionMatchedByText.id;
    }

    // Case 3: backend correct answer is numeric index.
    // Example: correctAnswer: 0 or correctAnswer: 1
    const numericIndex = Number(rawCorrectAnswer);

    if (Number.isInteger(numericIndex)) {
      if (normalizedOptions[numericIndex]) {
        return normalizedOptions[numericIndex].id;
      }

      if (normalizedOptions[numericIndex - 1]) {
        return normalizedOptions[numericIndex - 1].id;
      }
    }

    return correctAnswerString;
  };

  const normalizeBackendQuestions = (questions) => {
    return questions.map((question, questionIndex) => {
      const normalizedOptions = normalizeQuestionOptions(question);

      return {
        id: String(question._id ?? question.id ?? questionIndex + 1),
        question: String(
          question.question ??
            question.questionText ??
            question.title ??
            question.name ??
            "",
        ),
        options: normalizedOptions,
        correctOptionId: resolveCorrectOptionId(question, normalizedOptions),
      };
    });
  };

  const fetchQuestionsFromBackend = async (questionCount) => {
    // First try your quiz-attempt route.
    // This is useful if backend creates an attemptId.
    try {
      const response = await fetch(`${API_URL}/api/quiz-attempts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: "general-knowledge",
          questionCount,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const questions = extractQuestionsFromResponse(data);

        if (questions.length > 0) {
          return {
            attemptId: data.attemptId ?? data.attempt?._id ?? data._id ?? null,
            questions,
          };
        }
      }
    } catch (requestError) {
      console.warn("POST /api/quiz-attempts failed:", requestError.message);
    }

    const response = await fetch(
      `${API_URL}/api/questions?limit=${questionCount}`,
    );

    if (!response.ok) {
      throw new Error("Could not fetch questions from backend.");
    }

    const data = await response.json();
    const questions = extractQuestionsFromResponse(data);

    return {
      attemptId: data.attemptId ?? null,
      questions,
    };
  };

  const startGKQuiz = async (questionCount) => {
    try {
      setIsStartingQuiz(true);
      setError("");

      const backendData = await fetchQuestionsFromBackend(questionCount);

      const normalizedQuestions = normalizeBackendQuestions(
        backendData.questions,
      ).slice(0, questionCount);

      if (normalizedQuestions.length === 0) {
        throw new Error("No questions found in database.");
      }

      setAttemptId(backendData.attemptId);
      setQuizQuestions(normalizedQuestions);
      setSelectedQuestionCount(questionCount);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setQuizResult(null);
      setQuizStage("quiz");

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (requestError) {
      console.error(requestError);

      setError(
        "Questions could not be loaded from database. Check backend route, MongoDB data, and console.",
      );
    } finally {
      setIsStartingQuiz(false);
    }
  };

  const startQuizByCode = async () => {
    const cleanedCode = quizCode.trim();

    if (!cleanedCode) {
      setError("Please enter a quiz code.");
      return;
    }

    try {
      setIsStartingQuiz(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/quizzes/code/${encodeURIComponent(cleanedCode)}`,
      );

      if (!response.ok) {
        throw new Error("Quiz code not found.");
      }

      const data = await response.json();
      const questions = extractQuestionsFromResponse(data);
      const normalizedQuestions = normalizeBackendQuestions(questions);

      if (normalizedQuestions.length === 0) {
        throw new Error("This quiz has no questions.");
      }

      setAttemptId(data.attemptId ?? data.quiz?._id ?? null);
      setQuizQuestions(normalizedQuestions);
      setSelectedQuestionCount(normalizedQuestions.length);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setQuizResult(null);
      setQuizStage("quiz");

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (requestError) {
      console.error(requestError);
      setError("Quiz code feature is not connected yet or code is invalid.");
    } finally {
      setIsStartingQuiz(false);
    }
  };

  const handleAnswerSelection = (questionId, optionId) => {
    setSelectedAnswers((previousAnswers) => ({
      ...previousAnswers,
      [String(questionId)]: String(optionId),
    }));
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((previousIndex) => {
      return Math.max(previousIndex - 1, 0);
    });
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((previousIndex) => {
      return Math.min(previousIndex + 1, quizQuestions.length - 1);
    });
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const calculateLocalResult = () => {
    let score = 0;

    const results = quizQuestions.map((question) => {
      const selectedOptionId = selectedAnswers[String(question.id)];

      const selectedOption = question.options.find((option) => {
        return String(option.id) === String(selectedOptionId);
      });

      const correctOption = question.options.find((option) => {
        return String(option.id) === String(question.correctOptionId);
      });

      const isCorrect =
        selectedOptionId !== undefined &&
        String(selectedOptionId) === String(question.correctOptionId);

      if (isCorrect) {
        score += 1;
      }

      return {
        questionId: String(question.id),
        isCorrect,
        selectedAnswer: selectedOption?.text || "Not answered",
        correctAnswer: correctOption?.text || "Not available",
      };
    });

    const totalQuestions = quizQuestions.length;

    return {
      score,
      totalQuestions,
      percentage:
        totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0,
      results,
    };
  };

  const submitQuiz = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      // If backend gave an attemptId, submit answers to backend.
      if (attemptId) {
        const answers = Object.entries(selectedAnswers).map(
          ([questionId, optionId]) => ({
            questionId,
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

        if (response.ok) {
          const resultData = await response.json();

          setQuizResult(resultData);
          setQuizStage("result");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }

      // If you are using simple GET /api/questions route,
      // frontend calculates result using correct answer received from DB.
      const localResult = calculateLocalResult();

      setQuizResult(localResult);
      setQuizStage("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (requestError) {
      console.error(requestError);

      const localResult = calculateLocalResult();

      setQuizResult(localResult);
      setQuizStage("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const restartQuiz = () => {
    if (selectedQuestionCount) {
      startGKQuiz(selectedQuestionCount);
    }
  };

  const returnToQuizSelection = () => {
    resetQuizState();
    setPageMode("gk");
  };

  if (quizStage === "selection" && pageMode === "menu") {
    return (
      <main className="take-quiz-page">
        <section className="quiz-selection">
          <div className="quiz-heading">
            <span className="quiz-label">TAKE QUIZ</span>

            <h1>Choose how you want to take the quiz</h1>

            <p>
              You can enter a quiz code or practice a general knowledge quiz.
            </p>
          </div>

          <div className="quiz-option-grid">
            <button className="quiz-option-card" onClick={goToCodeSelection}>
              <span className="quiz-option-number">#</span>

              <span className="quiz-option-content">
                <strong>Enter Quiz Code</strong>
                <small>Join a quiz shared by a creator.</small>
              </span>

              <span className="quiz-option-arrow" aria-hidden="true">
                →
              </span>
            </button>

            <button className="quiz-option-card" onClick={goToGKSelection}>
              <span className="quiz-option-number">GK</span>

              <span className="quiz-option-content">
                <strong>Take GK Quiz</strong>
                <small>Practice general knowledge questions.</small>
              </span>

              <span className="quiz-option-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (quizStage === "selection" && pageMode === "code") {
    return (
      <main className="take-quiz-page">
        <section className="quiz-selection">
          <div className="quiz-heading">
            <span className="quiz-label">QUIZ CODE</span>

            <h1>Enter quiz code</h1>

            <p>Use the code given by the quiz creator.</p>

            {error && <p className="quiz-error-message">{error}</p>}
          </div>

          <div className="quiz-status-card">
            <input
              type="text"
              value={quizCode}
              placeholder="Enter code"
              onChange={(event) => {
                setQuizCode(event.target.value);
                setError("");
              }}
            />

            <button
              className="primary-button"
              onClick={startQuizByCode}
              disabled={isStartingQuiz}
            >
              {isStartingQuiz ? "Starting..." : "Start quiz"}
            </button>

            <button className="secondary-button" onClick={goBackToMainMenu}>
              ← Back
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (quizStage === "selection" && pageMode === "gk") {
    return (
      <main className="take-quiz-page">
        <section className="quiz-selection">
          <div className="quiz-heading">
            <span className="quiz-label">GENERAL KNOWLEDGE</span>

            <h1>Choose your quiz</h1>

            <p>Select the number of questions you would like to answer.</p>

            {isLoadingOptions && <p>Loading quiz options...</p>}

            {error && <p className="quiz-error-message">{error}</p>}
          </div>

          <div className="quiz-option-grid">
            {quizOptions.map((option) => (
              <button
                key={option.id}
                className="quiz-option-card"
                onClick={() => startGKQuiz(option.questionCount)}
                disabled={isStartingQuiz}
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

          <button className="secondary-button" onClick={goBackToMainMenu}>
            ← Back
          </button>
        </section>
      </main>
    );
  }

  if (quizStage === "quiz" && currentQuestion) {
    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

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
                  const isAnswered =
                    selectedAnswers[String(question.id)] !== undefined;

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

            <QuizCard
              currentQuestion={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              selectedAnswers={selectedAnswers}
              unansweredQuestionCount={unansweredQuestionCount}
              isFirstQuestion={isFirstQuestion}
              isLastQuestion={isLastQuestion}
              isSubmitting={isSubmitting}
              onAnswerSelection={handleAnswerSelection}
              onPreviousQuestion={goToPreviousQuestion}
              onNextQuestion={goToNextQuestion}
              onSubmitQuiz={submitQuiz}
            />
          </div>
        </section>
      </main>
    );
  }

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

              <button className="secondary-button" onClick={goBackToMainMenu}>
                Back to quiz menu
              </button>
            </div>
          </div>

          <div className="answer-review">
            <div className="review-heading">
              <h2>Answer review</h2>

              <span>{quizResult.totalQuestions} questions</span>
            </div>

            {quizResult.results.map((result, index) => {
              const question = quizQuestions.find((item) => {
                return String(item.id) === String(result.questionId);
              });

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

  return (
    <main className="take-quiz-page">
      <div className="quiz-status-card">
        <h2>Something went wrong</h2>

        <button className="primary-button" onClick={goBackToMainMenu}>
          Back to quiz menu
        </button>
      </div>
    </main>
  );
}

export default TakeQuiz;
