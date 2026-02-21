// JobBrowser Component - Manages job browsing experience

import React from 'react';
import { JobCard } from './JobCard';
import './JobBrowser.css';

export const JobBrowser = ({ jobs, currentIndex, onMatch, onSkip, onNavigateToMatches }) => {
  const currentJob = jobs[currentIndex];
  const isComplete = currentIndex >= jobs.length;

  if (isComplete) {
    return (
      <div className="job-browser-complete" data-testid="completion-message">
        <div className="complete-card">
          <h2>🎉 All Done!</h2>
          <p>You've reviewed all available job postings.</p>
          <button
            className="btn btn-primary"
            onClick={onNavigateToMatches}
          >
            View Your Matches
          </button>
        </div>
      </div>
    );
  }

  const handleLike = (jobId) => {
    onMatch(currentJob);
  };

  const handleDislike = (jobId) => {
    onSkip();
  };

  return (
    <div className="job-browser">
      <div className="job-counter">
        Job {currentIndex + 1} of {jobs.length}
      </div>
      <JobCard
        job={currentJob}
        onLike={handleLike}
        onDislike={handleDislike}
      />
    </div>
  );
};
