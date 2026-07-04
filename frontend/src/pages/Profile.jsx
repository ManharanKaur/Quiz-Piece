import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

function Profile() {
  const {
    user,
    authLoading,
    login,
    register,
    logout,
    deleteMyAccount,
    isAuthenticated,
  } = useAuth();

  // false means login mode, true means register mode.
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Keep previous values and update only the input that changed.
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });

        setSuccessMessage("Account created successfully.");
      } else {
        await login({
          email: formData.email.trim(),
          password: formData.password,
        });

        setSuccessMessage("Login successful.");
      }

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmDelete) return;

    setError("");
    setSuccessMessage("");

    try {
      await deleteMyAccount();
      setSuccessMessage("Account deleted successfully.");
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAuthMode = () => {
    setIsRegisterMode((previousMode) => !previousMode);
    setError("");
    setSuccessMessage("");

    // Clear form when switching between login/register.
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  if (authLoading) {
    return (
      <main className="profile-page">
        <section className="profile-card">
          <p className="profile-loading">Checking login status...</p>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="profile-page">
        <section className="auth-card">
          <Link to="/" className="profile-back-link">
            ← Back to Home
          </Link>

          <div className="auth-header">
            <span className="auth-label">QUIZ APP</span>

            <h1>{isRegisterMode ? "Create your account" : "Welcome back"}</h1>

            <p>
              {isRegisterMode
                ? "Register to save your quiz history and profile."
                : "Login to view your profile and saved data."}
            </p>
          </div>

          {error && <p className="auth-message auth-message-error">{error}</p>}

          {successMessage && (
            <p className="auth-message auth-message-success">
              {successMessage}
            </p>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegisterMode && (
              <label className="auth-field">
                <span>Name</span>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required={isRegisterMode}
                />
              </label>
            )}

            <label className="auth-field">
              <span>Email</span>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                minLength="6"
                required
              />
            </label>

            <button
              className="auth-submit-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Please wait..."
                : isRegisterMode
                  ? "Create Account"
                  : "Login"}
            </button>
          </form>

          <button
            className="auth-switch-button"
            type="button"
            onClick={toggleAuthMode}
          >
            {isRegisterMode
              ? "Already have an account? Login"
              : "New here? Create an account"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <Link to="/" className="profile-back-link">
          ← Back to Home
        </Link>

        <div className="profile-header">
          <div className="profile-avatar">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <span className="profile-label">MY PROFILE</span>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </div>

        {error && <p className="auth-message auth-message-error">{error}</p>}

        {successMessage && (
          <p className="auth-message auth-message-success">{successMessage}</p>
        )}

        <div className="profile-info-grid">
          <div className="profile-info-card">
            <span>Name</span>
            <strong>{user.name}</strong>
          </div>

          <div className="profile-info-card">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-info-card">
            <span>Quiz History</span>
            <strong>Coming soon</strong>
          </div>

          <div className="profile-info-card">
            <span>Theme</span>
            <strong>Coming soon</strong>
          </div>
        </div>

        <div className="profile-actions">
          <button
            className="profile-logout-button"
            type="button"
            onClick={logout}
          >
            Logout
          </button>

          <button
            className="profile-delete-button"
            type="button"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </section>
    </main>
  );
}

export default Profile;
