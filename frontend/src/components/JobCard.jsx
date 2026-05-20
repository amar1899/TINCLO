// JobCard Component - Full job details with in-app apply modal

import React, { useState } from 'react';
import ApiService from '../services/ApiService';
import './JobCard.css';

const SOURCE_COLORS = {
  'Naukri':    { bg: '#ff6b35', text: '#fff' },
  'LinkedIn':  { bg: '#0077b5', text: '#fff' },
  'Indeed':    { bg: '#2164f3', text: '#fff' },
  'Glassdoor': { bg: '#0caa41', text: '#fff' },
  'External':  { bg: '#764ba2', text: '#fff' },
  'mock':      { bg: '#667eea', text: '#fff' },
};

// In-app Apply Modal
const ApplyModal = ({ job, onClose, currentUser }) => {
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    experience: '',
    coverLetter: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [emailValidating, setEmailValidating] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateEmailOnBlur = async () => {
    if (!form.email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setEmailValidating(true);
    try {
      const result = await ApiService.validateEmail(form.email);
      if (!result.valid) {
        setError('Please use a real email address. Disposable emails are not allowed.');
      } else {
        setError('');
      }
    } catch {
      // ignore validation errors silently
    } finally {
      setEmailValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!form.name.trim()) { setError('Full name is required.'); return; }
    if (!form.email.trim()) { setError('Email address is required.'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(form.email)) { setError('Please enter a valid email address.'); return; }
    if (form.phone && !/^[+\d\s\-()]{7,15}$/.test(form.phone)) { setError('Please enter a valid phone number.'); return; }
    if (!form.experience) { setError('Please select your experience level.'); return; }

    setLoading(true);
    try {
      const result = await ApiService.applyToJob({
        name: form.name,
        email: form.email,
        phone: form.phone,
        experience: form.experience,
        coverLetter: form.coverLetter,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        jobId: job._id || job.id,
      });
      setSuccess(result.message || 'Application submitted! Check your email for confirmation.');
      if (result.previewUrl) setPreviewUrl(result.previewUrl);
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-modal-overlay" onClick={onClose}>
      <div className="apply-modal" onClick={(e) => e.stopPropagation()}>
        <button className="apply-modal-close" onClick={onClose} aria-label="Close">×</button>

        <div className="apply-modal-header">
          <h2>Apply for {job.title}</h2>
          <p>at <strong>{job.company}</strong> · {job.location}</p>
        </div>

        {success ? (
          <div className="apply-success-state">
            <div className="apply-success-icon">✅</div>
            <h3>Application Submitted!</h3>
            <p>{success}</p>
            {previewUrl ? (
              <div className="apply-preview-box">
                <p className="apply-success-note">📧 Click below to view your confirmation email:</p>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apply-preview-link"
                >
                  📬 View Confirmation Email
                </a>
                <p style={{ fontSize: '11px', color: '#a0aec0', marginTop: '8px' }}>
                  (Opens in Ethereal — free test email viewer)
                </p>
              </div>
            ) : (
              <p className="apply-success-note">A confirmation email has been sent to <strong>{form.email}</strong></p>
            )}
            <button className="apply-submit-btn" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form className="apply-form" onSubmit={handleSubmit}>
            <div className="apply-form-row">
              <div className="apply-form-group">
                <label>Full Name *</label>
                <input
                  type="text" name="name" value={form.name}
                  onChange={handleChange} placeholder="Your full name"
                  required disabled={loading}
                />
              </div>
              <div className="apply-form-group">
                <label>Email Address *</label>
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange} onBlur={validateEmailOnBlur}
                  placeholder="your@email.com" required disabled={loading}
                />
                {emailValidating && <span className="email-validating">Validating...</span>}
              </div>
            </div>

            <div className="apply-form-row">
              <div className="apply-form-group">
                <label>Phone Number</label>
                <input
                  type="tel" name="phone" value={form.phone}
                  onChange={handleChange} placeholder="+91 98765 43210"
                  disabled={loading}
                />
              </div>
              <div className="apply-form-group">
                <label>Years of Experience *</label>
                <select name="experience" value={form.experience} onChange={handleChange} required disabled={loading}>
                  <option value="">Select experience</option>
                  <option value="Fresher (0 years)">Fresher (0 years)</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-4 years">2-4 years</option>
                  <option value="4-6 years">4-6 years</option>
                  <option value="6-10 years">6-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>
            </div>

            <div className="apply-form-group">
              <label>Cover Letter / Why should we hire you?</label>
              <textarea
                name="coverLetter" value={form.coverLetter}
                onChange={handleChange} rows={4}
                placeholder="Tell us about yourself and why you're a great fit for this role..."
                disabled={loading}
              />
            </div>

            {error && <div className="apply-error">⚠️ {error}</div>}

            <button type="submit" className="apply-submit-btn" disabled={loading || !!error}>
              {loading ? <><span className="apply-spinner"></span>Submitting...</> : '🚀 Submit Application'}
            </button>

            <p className="apply-email-note">
              📧 A confirmation email will be sent to your email address upon successful submission.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export const JobCard = ({ job, onLike, onDislike, currentUser }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const sourceStyle = SOURCE_COLORS[job.source] || SOURCE_COLORS['External'];

  const shortDesc = job.description?.slice(0, 180);
  const hasMore = job.description?.length > 180;

  return (
    <>
      <div className="job-card" data-testid="job-card">
        <div className="job-card-header">
          <div className="company-badge">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="company-logo-img"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            ) : null}
            <div className="company-logo" style={job.companyLogo ? { display: 'none' } : {}}>
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div className="company-info">
              <h3 className="job-company">{job.company}</h3>
              <span className="job-type">{job.jobType || 'Full-time'}</span>
            </div>
          </div>

          <div className="job-header-right">
            {job.source && (
              <span className="job-source-badge" style={{ background: sourceStyle.bg, color: sourceStyle.text }}>
                via {job.source === 'mock' ? 'Naukri' : job.source}
              </span>
            )}
          </div>
        </div>

        <div className="job-card-body">
          <h2 className="job-title">{job.title}</h2>

          <div className="job-meta">
            <div className="job-meta-item">
              <span className="meta-icon">📍</span>
              <span className="meta-text">{job.location}</span>
            </div>
            <div className="job-meta-item">
              <span className="meta-icon">💰</span>
              <span className="meta-text">{job.salary}</span>
            </div>
            {job.experience && (
              <div className="job-meta-item">
                <span className="meta-icon">🧑‍💼</span>
                <span className="meta-text">{job.experience}</span>
              </div>
            )}
          </div>

          <div className="job-description">
            <p>
              {showFullDesc ? job.description : shortDesc}
              {hasMore && !showFullDesc && '...'}
            </p>
            {hasMore && (
              <button className="read-more-btn" onClick={() => setShowFullDesc(!showFullDesc)}>
                {showFullDesc ? 'Show less ▲' : 'Read more ▼'}
              </button>
            )}
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="job-requirements">
              <p className="requirements-label">🛠 Required Skills:</p>
              <div className="requirements-list">
                {job.requirements.map((req, i) => (
                  <span key={i} className="requirement-tag">{req}</span>
                ))}
              </div>
            </div>
          )}

          <div className="job-tags">
            {job.tags && job.tags.length > 0
              ? job.tags.map((tag, i) => <span key={i} className="job-tag">{tag}</span>)
              : <><span className="job-tag">Full-time</span><span className="job-tag">India</span></>
            }
          </div>

          {/* In-app Apply button */}
          <button
            className="btn-apply-now"
            onClick={() => setShowApplyModal(true)}
            aria-label={`Apply for ${job.title} at ${job.company}`}
          >
            🚀 Apply Now — via TINCLO
          </button>
        </div>

        <div className="job-card-actions">
          <button className="btn btn-dislike" onClick={() => onDislike(job._id || job.id)} aria-label="Pass">
            <span className="btn-icon">✕</span>
            <span className="btn-text">Pass</span>
          </button>
          <button className="btn btn-like" onClick={() => onLike(job._id || job.id)} aria-label="Like">
            <span className="btn-icon">❤️</span>
            <span className="btn-text">Like</span>
          </button>
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal
          job={job}
          currentUser={currentUser}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </>
  );
};
