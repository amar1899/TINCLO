import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import NavigationLanding from "./NavigationLanding";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validate form
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Check localStorage for user
      const existingUsers = JSON.parse(localStorage.getItem('tinclo_users') || '[]');
      const user = existingUsers.find(u => u.email === form.email && u.password === form.password);
      
      if (!user) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      // Set current user
      localStorage.setItem('tinclo_current_user', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email
      }));

      setSuccess(`Welcome back, ${user.name}! Redirecting to jobs...`);
      setForm({ email: "", password: "" });

      // Redirect to jobs page after 1 second
      setTimeout(() => {
        navigate('/jobs');
      }, 1000);

    } catch (err) {
      console.error('Login error:', err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    // Validate email
    if (!resetEmail) {
      setResetError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setResetError("Please enter a valid email address.");
      return;
    }

    // Check if user exists
    const existingUsers = JSON.parse(localStorage.getItem('tinclo_users') || '[]');
    const user = existingUsers.find(u => u.email === resetEmail);

    if (!user) {
      setResetError("No account found with this email address.");
      return;
    }

    // Show password (in production, you'd send a reset email)
    setResetSuccess(`Your password is: ${user.password}`);
    
    // Auto-close modal after 5 seconds
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetEmail("");
      setResetSuccess("");
    }, 5000);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setResetEmail("");
    setResetError("");
    setResetSuccess("");
  };

  return (
    <>
      <NavigationLanding />
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Login to continue your job search</p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
                minLength={6}
              />
            </div>

            <div className="forgot-password-link">
              <button 
                type="button" 
                onClick={() => setShowForgotPassword(true)}
                className="forgot-link"
              >
                Forgot Password?
              </button>
            </div>

            {error && <div className="login-error">{error}</div>}
            {success && <div className="login-success">{success}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <a href="/signup" className="signup-link">
                Sign Up
              </a>
            </p>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="modal-overlay" onClick={closeForgotPasswordModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeForgotPasswordModal}>
                ×
              </button>
              <h3>Reset Password</h3>
              <p className="modal-description">
                Enter your email address and we'll show you your password.
              </p>
              
              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label htmlFor="reset-email">Email Address</label>
                  <input
                    type="email"
                    id="reset-email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>

                {resetError && <div className="login-error">{resetError}</div>}
                {resetSuccess && (
                  <div className="login-success">
                    <strong>Password Found!</strong>
                    <br />
                    {resetSuccess}
                    <br />
                    <small>This modal will close in 5 seconds...</small>
                  </div>
                )}

                <button type="submit" className="login-button">
                  Retrieve Password
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LoginPage;
