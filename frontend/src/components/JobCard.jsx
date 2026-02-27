// JobCard Component - Displays a single job posting with Like/Dislike buttons

import React from 'react';
import './JobCard.css';

export const JobCard = ({ job, onLike, onDislike }) => {
  return (
    <div className="job-card" data-testid="job-card">
      <div className="job-card-header">
        <div className="company-badge">
          <div className="company-logo">
            {job.company.charAt(0).toUpperCase()}
          </div>
          <div className="company-info">
            <h3 className="job-company">{job.company}</h3>
            <span className="job-type">Full-time</span>
          </div>
        </div>
        <div className="job-featured-badge">✨ Featured</div>
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
        </div>
        
        <div className="job-description">
          <p>{job.description}</p>
        </div>

        <div className="job-tags">
          <span className="job-tag">Remote Friendly</span>
          <span className="job-tag">Health Insurance</span>
          <span className="job-tag">401(k)</span>
        </div>
      </div>
      
      <div className="job-card-actions">
        <button
          className="btn btn-dislike"
          onClick={() => onDislike(job.id)}
          aria-label="Dislike job"
        >
          <span className="btn-icon">✕</span>
          <span className="btn-text">Pass</span>
        </button>
        <button
          className="btn btn-like"
          onClick={() => onLike(job.id)}
          aria-label="Like job"
        >
          <span className="btn-icon">❤️</span>
          <span className="btn-text">Like</span>
        </button>
      </div>
    </div>
  );
};
