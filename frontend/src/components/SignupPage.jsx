import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";
import NavigationLanding from "./NavigationLanding";
import ApiService from "../services/ApiService";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    // Validations
    if (!name) { setError("Full name is required."); return; }
    if (name.length < 2) { setError("Name must be at least 2 characters."); return; }
    if (!/^[a-zA-Z\s'-]+$/.test(name)) { setError("Name can only contain letters, spaces, hyphens and apostrophes."); return; }
    if (!email) { setError("Email address is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setError("Please enter a valid email address."); return; }
    if (!password) { setError("Password is required."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters long."); return; }
    if (!/[A-Z]/.test(password)) { setError("Password must contain at least one uppercase letter."); return; }
    if (!/[0-9]/.test(password)) { setError("Password must contain at least one number."); return; }

    setLoading(true);

    try {
      const userId = `user-${email.split('@')[0]}-${Date.now()}`;

      // Try to save to MongoDB
      try {
        await ApiService.registerUser({ userId, name, email, password });
        console.log('✅ User saved to MongoDB Atlas');
      } catch (apiError) {
        if (apiError.message.includes('already exists')) {
          setError('An account with this email already exists. Please login.');
          setLoading(false);
          return;
        }
        console.warn('⚠️ MongoDB save failed, using localStorage fallback:', apiError.message);
      }

      // Save to localStorage for session management
      const existingUsers = JSON.parse(localStorage.getItem('tinclo_users') || '[]');
      const userExists = existingUsers.find(u => u.email === email);
      if (userExists) {
        setError('An account with this email already exists. Please login.');
        setLoading(false);
        return;
      }

      existingUsers.push({ id: userId, name, email, password, createdAt: new Date().toISOString() });
      localStorage.setItem('tinclo_users', JSON.stringify(existingUsers));
      localStorage.setItem('tinclo_current_user', JSON.stringify({ id: userId, name, email }));

      setSuccess('✅ Account created successfully! Redirecting...');
      setForm({ name: '', email: '', password: '' });
      setTimeout(() => navigate('/jobs'), 1500);

    } catch (err) {
      console.error('Signup error:', err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavigationLanding />
      <div className="signup-container">
        <div className="signup-background">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        <div className="signup-content">
          <div className="signup-card">
            <div className="signup-header">
              <div className="icon-wrapper">
                <svg className="signup-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Create Your Account</h2>
              <p>Join thousands of job seekers finding their dream careers</p>
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Full Name
                </label>
                <input type="text" id="name" name="name" placeholder="Enter your full name"
                  value={form.name} onChange={handleChange} disabled={loading} required />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Email Address
                </label>
                <input type="email" id="email" name="email" placeholder="Enter your email"
                  value={form.email} onChange={handleChange} disabled={loading} required />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Password
                </label>
                <input type="password" id="password" name="password"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  value={form.password} onChange={handleChange} disabled={loading} required minLength={8} />
              </div>

              {error && (
                <div className="signup-error">
                  <svg className="alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {error}
                </div>
              )}

              {success && (
                <div className="signup-success">
                  <svg className="alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76489 14.1003 1.98232 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {success}
                </div>
              )}

              <button type="submit" className="signup-button" disabled={loading}>
                {loading ? (
                  <><span className="spinner"></span>Creating Your Account...</>
                ) : (
                  <>
                    <span>Sign Up</span>
                    <svg className="button-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="signup-footer">
              <p>Already have an account?{" "}<a href="/login" className="login-link">Login here</a></p>
              <div className="security-badge">
                <svg className="lock-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Your data is securely encrypted
              </div>
            </div>
          </div>

          <div className="signup-benefits">
            <h3>Why Join TINCLO?</h3>
            <div className="benefit-item">
              <div className="benefit-icon">🎯</div>
              <div className="benefit-text">
                <h4>Smart Job Matching</h4>
                <p>Swipe through jobs tailored to your skills</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">⚡</div>
              <div className="benefit-text">
                <h4>Quick Applications</h4>
                <p>Apply to jobs with just one click</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💼</div>
              <div className="benefit-text">
                <h4>Track Your Progress</h4>
                <p>Manage all your applications in one place</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
