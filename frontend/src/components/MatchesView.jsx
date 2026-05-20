// MatchesView Component - Displays all matched jobs with in-app apply modal

import React, { useState } from 'react';
import ApiService from '../services/ApiService';
import './MatchesView.css';

const SOURCE_CONFIG = {
  'Naukri':    { color: '#ff6b35', label: 'Naukri' },
  'LinkedIn':  { color: '#0077b5', label: 'LinkedIn' },
  'Indeed':    { color: '#2164f3', label: 'Indeed' },
  'Glassdoor': { color: '#0caa41', label: 'Glassdoor' },
  'Direct':    { color: '#764ba2', label: 'Company Site' },
};

const getConfig = (job) => {
  if (job.source && SOURCE_CONFIG[job.source]) return SOURCE_CONFIG[job.source];
  if (job.applyUrl) {
    if (job.applyUrl.includes('linkedin.com'))  return SOURCE_CONFIG['LinkedIn'];
    if (job.applyUrl.includes('indeed.com'))    return SOURCE_CONFIG['Indeed'];
    if (job.applyUrl.includes('glassdoor'))     return SOURCE_CONFIG['Glassdoor'];
    if (job.applyUrl.includes('naukri.com'))    return SOURCE_CONFIG['Naukri'];
  }
  return SOURCE_CONFIG['Naukri'];
};

// ── In-app Apply Modal (same as JobCard) ──
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Full name is required.'); return; }
    if (!form.email.trim()) { setError('Email address is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) { setError('Please enter a valid email address.'); return; }
    if (!form.experience) { setError('Please select your experience level.'); return; }

    setLoading(true);
    try {
      const result = await ApiService.applyToJob({
        name: form.name, email: form.email, phone: form.phone,
        experience: form.experience, coverLetter: form.coverLetter,
        jobTitle: job.title, company: job.company,
        location: job.location, salary: job.salary,
        jobId: job._id || job.id,
      });
      setSuccess(result.message || 'Application submitted!');
      if (result.previewUrl) setPreviewUrl(result.previewUrl);
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-modal-overlay" onClick={onClose}>
      <div className="apply-modal" onClick={(e) => e.stopPropagation()}>
        <button className="apply-modal-close" onClick={onClose}>×</button>
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
                <p className="apply-success-note">📧 Click to view your confirmation email:</p>
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="apply-preview-link">
                  📬 View Confirmation Email
                </a>
              </div>
            ) : (
              <p className="apply-success-note">Confirmation sent to <strong>{form.email}</strong></p>
            )}
            <button className="apply-submit-btn" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form className="apply-form" onSubmit={handleSubmit}>
            <div className="apply-form-row">
              <div className="apply-form-group">
                <label>Full Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required disabled={loading} />
              </div>
              <div className="apply-form-group">
                <label>Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required disabled={loading} />
              </div>
            </div>
            <div className="apply-form-row">
              <div className="apply-form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" disabled={loading} />
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
              <label>Cover Letter</label>
              <textarea name="coverLetter" value={form.coverLetter} onChange={handleChange} rows={4} placeholder="Tell us why you're a great fit..." disabled={loading} />
            </div>
            {error && <div className="apply-error">⚠️ {error}</div>}
            <button type="submit" className="apply-submit-btn" disabled={loading}>
              {loading ? <><span className="apply-spinner"></span>Submitting...</> : '🚀 Apply Now — via TINCLO'}
            </button>
            <p className="apply-email-note">📧 A confirmation email will be sent upon submission.</p>
          </form>
        )}
      </div>
    </div>
  );
};

// ── Main MatchesView ──
export const MatchesView = ({ matches, onApply, onUndoApply, onNavigateToBrowser, currentUser }) => {
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [applyJob, setApplyJob] = useState(null);

  if (matches.length === 0) {
    return (
      <div className="matches-empty" data-testid="empty-matches">
        <div className="empty-card">
          <h2>No Matches Yet</h2>
          <p>Start browsing jobs and like the ones you're interested in!</p>
          <button className="btn btn-primary" onClick={onNavigateToBrowser}>Browse Jobs</button>
        </div>
      </div>
    );
  }

  const selectedMatch = selectedMatchId
    ? matches.find(m => (m.job.id || m.job._id) === selectedMatchId)
    : null;

  return (
    <div className="matches-view">
      <div className="matches-header">
        <h2>Your Matches ({matches.length})</h2>
      </div>

      <div className="matches-list">
        {matches.map((match) => {
          const jobId = match.job.id || match.job._id;
          const cfg = getConfig(match.job);

          return (
            <div
              key={jobId}
              className={`match-item ${selectedMatchId === jobId ? 'selected' : ''}`}
              onClick={() => setSelectedMatchId(prev => prev === jobId ? null : jobId)}
              data-testid="match-item"
            >
              <div className="match-left">
                <div className="match-company-logo"
                  style={{ background: `linear-gradient(135deg, ${cfg.color}, #764ba2)` }}>
                  {match.job.company.charAt(0).toUpperCase()}
                </div>
                <div className="match-info">
                  <div className="match-title-row">
                    <h3 className="match-title">{match.job.title}</h3>
                    <span className="match-source-badge" style={{ background: cfg.color }}>{cfg.label}</span>
                  </div>
                  <p className="match-company">{match.job.company}</p>
                  <p className="match-location">📍 {match.job.location}</p>
                  {match.job.salary && <p className="match-salary">💰 {match.job.salary}</p>}
                  {match.job.tags?.length > 0 && (
                    <div className="match-tags">
                      {match.job.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="match-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Apply Now button — same style as JobCard */}
              <div className="match-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="match-apply-now-btn"
                  onClick={(e) => { e.stopPropagation(); setApplyJob(match.job); }}
                  aria-label={`Apply for ${match.job.title}`}
                >
                  🚀 Apply Now — via TINCLO
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail panel */}
      {selectedMatch && (() => {
        const cfg = getConfig(selectedMatch.job);
        return (
          <div className="match-details" data-testid="match-details">
            <div className="detail-header">
              <div>
                <h3>{selectedMatch.job.title}</h3>
                <p className="detail-company">{selectedMatch.job.company}</p>
              </div>
              <button
                className="match-apply-now-btn"
                onClick={() => setApplyJob(selectedMatch.job)}
              >
                🚀 Apply Now — via TINCLO
              </button>
            </div>
            <div className="detail-section">
              <div className="detail-info">
                <span><strong>📍 Location:</strong> {selectedMatch.job.location}</span>
                <span><strong>💰 Salary:</strong> {selectedMatch.job.salary}</span>
              </div>
              {selectedMatch.job.tags?.length > 0 && (
                <div className="detail-tags">
                  {selectedMatch.job.tags.map((tag, i) => <span key={i} className="match-tag">{tag}</span>)}
                </div>
              )}
              <div className="detail-description">
                <strong>Description:</strong>
                <p>{selectedMatch.job.description}</p>
              </div>
              <div className="detail-meta">
                <small>Matched on: {selectedMatch.matchedAt.toLocaleDateString()}</small>
              </div>
            </div>
          </div>
        );
      })()}

      {/* In-app Apply Modal */}
      {applyJob && (
        <ApplyModal
          job={applyJob}
          currentUser={currentUser}
          onClose={() => setApplyJob(null)}
        />
      )}
    </div>
  );
};
