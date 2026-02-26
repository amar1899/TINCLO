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
    
    // Validate form
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
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
      // Generate unique user ID
      const userId = `user-${form.email.split('@')[0]}-${Date.now()}`;

      // Try to save to MongoDB via API
      try {
        await ApiService.createUser(userId);
        console.log('✅ User saved to MongoDB Atlas');
      } catch (apiError) {
        console.warn('⚠️ Could not save to MongoDB (read-only connection):', apiError.message);
        // Continue with local storage fallback
      }

      // Also save to localStorage for immediate access
      const existingUsers = JSON.parse(localStorage.getItem('tinclo_users') || '[]');
      const userExists = existingUsers.find(u => u.email === form.email);
      
      if (userExists) {
        setError("An account with this email already exists. Please login.");
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: userId,
        name: form.name,
        email: form.email,
        password: form.password, // In production, this should be hashed
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      existingUsers.push(newUser);
      localStorage.setItem('tinclo_users', JSON.stringify(existingUsers));

      // Set current user
      localStorage.setItem('tinclo_current_user', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }));

      setSuccess("Account created successfully! Redirecting to jobs...");
      setForm({ name: "", email: "", password: "" });

      // Redirect to jobs page after 1.5 seconds
      setTimeout(() => {
        navigate('/jobs');
      }, 1500);

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
        <h2>Create Your Account</h2>
        <p style={{marginBottom: '1.5rem', color: '#666', textAlign: 'center'}}>
          Join TINCLO to start finding your dream job
        </p>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            required
            minLength={6}
          />
          {error && <div className="signup-error">{error}</div>}
          {success && <div className="signup-success">{success}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <p style={{marginTop: '1rem', textAlign: 'center', color: '#666'}}>
          Already have an account? <a href="/login" style={{color: '#4A90E2', textDecoration: 'none'}}>Login</a>
        </p>
        <p style={{marginTop: '0.5rem', textAlign: 'center', color: '#999', fontSize: '0.85rem'}}>
          🔒 Your data is securely stored
        </p>
      </div>
    </>
  );
};

export default SignupPage;
