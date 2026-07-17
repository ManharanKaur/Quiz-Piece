import React from "react";
import QuizProgress from "./QuizProgress";
import OptionsPage from "./OptionsPage";

function QuizSessionPage({
  quizStage,
  quizQuestions,
  currentQuestionIndex,
  selectedAnswers,
  quizResult,
  answeredQuestionCount,
  unansweredQuestionCount,
  error,
  isSubmitting,
  selectedQuestionCount,
  onGoToQuestion,
  onAnswerSelection,
  onPreviousQuestion,
  onNextQuestion,
  onSubmitQuiz,
  onRestartQuiz,
  onReturnToQuizSelection,
  onBackToMainMenu,
}) {
  if (quizStage === "result") {
    if (!quizResult) return null;

    return (
      <main className="take-quiz-page">
        <div className="result-container">
          <section className="result-summary">
            <h1>Quiz Complete!</h1>
            <p>You have finished the quiz.</p>

            <div className="score-circle">
              <strong>{quizResult.score}</strong>
              <span>out of {quizResult.totalQuestions}</span>
            </div>
            
            <p style={{ color: "#ffc400", fontWeight: "bold", fontSize: "1.2rem" }}>
              {quizResult.percentage}% Score
            </p>

            <div className="result-actions">
              <button className="primary-button" onClick={onRestartQuiz}>
                Play Again
              </button>
              <button className="secondary-button" onClick={onReturnToQuizSelection}>
                Choose Another Quiz
              </button>
              <button className="secondary-button" onClick={onBackToMainMenu}>
                Main Menu
              </button>
            </div>
          </section>

          <section className="answer-review">
            <div className="review-heading">
              <h2>Answer Review</h2>
              <span>{quizResult.totalQuestions} Questions</span>
            </div>

            {quizResult.results?.map((res, index) => (
              <div 
                key={res.questionId} 
                className={`review-card ${res.isCorrect ? "correct-review" : "incorrect-review"}`}
              >
                <div className="review-question-header">
                  <span>Question {index + 1}</span>
                  <strong>{res.isCorrect ? "CORRECT" : "INCORRECT"}</strong>
                </div>
                
                <h3>{quizQuestions[index]?.question}</h3>

                <div className={`review-answer-row ${res.isCorrect ? "correct-answer-row" : ""}`}>
                  <span>Your Answer</span>
                  <p>{res.selectedAnswer}</p>
                </div>

                {!res.isCorrect && (
                  <div className="review-answer-row correct-answer-row">
                    <span>Correct Answer</span>
                    <p>{res.correctAnswer}</p>
                  </div>
                )}
              </div>
            ))}
          </section>
        </div>
      </main>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <main className="take-quiz-page">
      <div className="quiz-container">
        <div className="quiz-topbar">
          <h1>Question {currentQuestionIndex + 1}</h1>
          <div className="answered-count">
            {answeredQuestionCount} / {quizQuestions.length} Answered
          </div>
        </div>

        <QuizProgress current={currentQuestionIndex + 1} total={quizQuestions.length} />

        <div className="question-layout">
          <aside className="question-navigation">
            <h2>Questions</h2>
            <div className="question-number-grid">
              {quizQuestions.map((q, idx) => {
                const isAnswered = !!selectedAnswers[String(q.id)];
                const isCurrent = idx === currentQuestionIndex;
                let btnClass = "question-number-button";
                if (isCurrent) btnClass += " current";
                else if (isAnswered) btnClass += " answered";

                return (
                  <button
                    key={q.id}
                    className={btnClass}
                    onClick={() => onGoToQuestion(idx)}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            <div style={{ marginTop: "24px" }}>
              <button 
                className="submit-button" 
                style={{ width: "100%" }}
                onClick={onSubmitQuiz}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
          </aside>

          <section className="question-content">
            {error && <p className="quiz-error-message" style={{ color: "var(--quiz-danger)" }}>{error}</p>}
            
            <h2 style={{ fontSize: "1.8rem", color: "#fff", lineHeight: "1.5", margin: "0" }}>
              {currentQuestion?.question}
            </h2>

            {currentQuestion && (
              <OptionsPage 
                options={currentQuestion.options} 
                selectedOptionId={selectedAnswers[String(currentQuestion.id)]}
                onSelect={(optionId) => onAnswerSelection(currentQuestion.id, optionId)}
              />
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
              <button 
                className="secondary-button" 
                onClick={onPreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                ← Previous
              </button>

              <button 
                className="secondary-button" 
                onClick={onNextQuestion}
                disabled={currentQuestionIndex === quizQuestions.length - 1}
              >
                Next →
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default QuizSessionPage;
