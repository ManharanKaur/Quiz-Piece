import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  // Temporary profile data.
  // Later, this information will come from the logged-in user's backend account.
  const [user] = useState({
    name: "Manharan Kaur",
    email: "manharankaur@gmail.com",
  });

  // Stores a message that can be shown after the delete button is pressed.
  const [message, setMessage] = useState("");

  function handleDeleteAccount() {
    // window.confirm returns true when the user chooses OK
    // and false when the user chooses Cancel.
    const shouldDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!shouldDelete) {
      return;
    }

    // No account is actually deleted yet because there is no backend.
    setMessage(
      "Account deletion will be connected when the backend is created.",
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-header">
          <Link to="/" className="back-link">
            ← Back
          </Link>

          <h1>Profile</h1>
        </div>

        <div className="profile-avatar" aria-hidden="true">
          {/*
            charAt(0) returns the first character of the user's name.
            toUpperCase() makes that character uppercase.
          */}
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="profile-details">
          <div className="profile-field">
            <span className="profile-label">Name</span>
            <span className="profile-value">{user.name}</span>
          </div>

          <div className="profile-field">
            <span className="profile-label">Email</span>
            <span className="profile-value">{user.email}</span>
          </div>
        </div>

        <div className="danger-zone">
          <h2>Delete account</h2>

          <p>
            Deleting your account will permanently remove your profile, quiz
            history, and scores.
          </p>

          <button
            type="button"
            className="delete-account-button"
            onClick={handleDeleteAccount}
          >
            Delete account
          </button>

          {/* The message is displayed only when it is not an empty string. */}
          {message && <p className="profile-message">{message}</p>}
        </div>
      </section>
    </main>
  );
}

export default Profile;
