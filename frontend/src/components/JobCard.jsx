// JobCard Component - Displays a single job posting with Like/Dislike buttons

import React from 'react';
import './JobCard.css';

export const JobCard = ({ job, onLike, onDislike }) => {
  return (
    <div className="job-card" data-testid="job-card">
      <div className="job-card-header">
        <h2 className="job-title">{job.title}</h2>
        <h3 className="job-company">{job.company}</h3>
      </div>
      
      <div className="job-card-body">
        <div className="job-info">
          <span className="job-label">Location:</span>
          <span className="job-location">{job.location}</span>
        </div>
        
        <div className="job-info">
          <span className="job-label">Salary:</span>
          <span className="job-salary">{job.salary}</span>
        </div>
        
        <div className="job-description">
          <p>{job.description}</p>
        </div>
      </div>
      
      <div className="job-card-actions">
        <button
          className="btn btn-dislike"
          onClick={() => onDislike(job.id)}
          aria-label="Dislike job"
        >
          ✕ Dislike
        </button>
        <button
          className="btn btn-like"
          onClick={() => onLike(job.id)}
          aria-label="Like job"
        >
          ♥ Like
        </button>
      </div>
    </div>
  );
};
