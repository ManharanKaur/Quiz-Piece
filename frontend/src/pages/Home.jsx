import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <main className="home-page">
      {/* Profile Button */}
      <Link to="/profile" className="profile-link" aria-label="Open profile">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2 7 4.24 7 7s2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z" />
        </svg>
      </Link>

      <section className="home-content">
        {/* Left Side */}
        <div className="left-side">
          <h1 className="hero-title">
            <span className="q-wrap">
              <img src="./images/straw-hat.png" alt="" className="straw-hat" />
            </span>
            QUIZ
            <span>PIECE.</span>
          </h1>

          <div className="home-actions">
            <Link to="/create-quiz">
              <button type="button">➕ CREATE QUIZ</button>
            </Link>

            <Link to="/take-quiz" className="home-actions-link">
              ▶ TAKE QUIZ
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="right-side">
          <p>
            Create powerful quizzes in seconds.
            <br />
            <br />
            Challenge yourself and others across any topic.
            <br />
            <br />
            Learn, compete, and grow every day.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;
