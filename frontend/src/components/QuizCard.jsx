import "../styles/QuizCard.css";

function QuizCard({
  currentQuestion,
  currentQuestionIndex,
  selectedAnswers,
  unansweredQuestionCount,
  isFirstQuestion,
  isLastQuestion,
  isSubmitting,
  onAnswerSelection,
  onPreviousQuestion,
  onNextQuestion,
  onSubmitQuiz,
}) {
  return (
    <article className="question-card">
      <span className="question-count">
        Question {currentQuestionIndex + 1}
      </span>

      <h2>{currentQuestion.question}</h2>

      <div className="question-options">
        {currentQuestion.options.map((option, optionIndex) => {
          const isSelected = selectedAnswers[currentQuestion.id] === option.id;

          return (
            <label
              key={option.id}
              className={`answer-option ${isSelected ? "selected" : ""}`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                checked={isSelected}
                onChange={() =>
                  onAnswerSelection(currentQuestion.id, option.id)
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
          onClick={onPreviousQuestion}
          disabled={isFirstQuestion}
        >
          ← Previous
        </button>

        {!isLastQuestion ? (
          <button className="primary-button" onClick={onNextQuestion}>
            Next →
          </button>
        ) : (
          <button
            className="submit-button"
            onClick={onSubmitQuiz}
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
  );
}

export default QuizCard;
