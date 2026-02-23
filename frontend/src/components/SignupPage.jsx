
import React, { useState } from "react";
import "./SignupPage.css";
import NavigationLanding from "./NavigationLanding";


const SignupPage = () => {
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
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 201) {
        setSuccess("Signup successful! You can now log in.");
        setForm({ name: "", email: "", password: "" });
      } else {
        const data = await res.json();
        setError(data.message || "Signup failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavigationLanding />
      <div className="signup-container">
        <h2>Sign Up</h2>
        <div style={{marginBottom: '1rem', color: '#555', textAlign: 'center', fontSize: '0.95rem'}}>
          <strong>Demo credentials:</strong><br />
          Name: <span style={{fontFamily: 'monospace'}}>Test</span><br />
          Email: <span style={{fontFamily: 'monospace'}}>test@example.com</span><br />
          Password: <span style={{fontFamily: 'monospace'}}>test123</span>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />
          {error && <div className="signup-error">{error}</div>}
          {success && <div className="signup-success">{success}</div>}
          <button type="submit" disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
        </form>
      </div>
    </>
  );
};

export default SignupPage;
