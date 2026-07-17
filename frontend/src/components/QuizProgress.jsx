import React from "react";

function QuizProgress({ current, total }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="quiz-progress-track">
      <div
        className="quiz-progress-value"
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
  );
}

export default QuizProgress;
