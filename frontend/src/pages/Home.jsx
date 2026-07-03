import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <main className="home-page">
      {/* Link changes the React page without refreshing the browser. */}
      <Link to="/profile" className="profile-link" aria-label="Open profile">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </Link>

      <section className="home-content">
        <h1>Quiz Piece</h1>

        <p>Welcome to your quiz platform.</p>

        <div className="home-actions">
          {/* Create Quiz is hidden until that section is developed. */}
          <button className="hidden" type="button">
            Create Quiz
          </button>

          <button type="button">Take Quiz</button>
        </div>
      </section>
    </main>
  );
}

export default Home;
