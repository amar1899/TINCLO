// JobBrowser Component — Live jobs from Naukri, LinkedIn, Indeed, Glassdoor
// Falls back to mock jobs when backend is unreachable

import React, { useState, useEffect, useCallback } from 'react';
import { JobCard } from './JobCard';
import ApiService from '../services/ApiService';
import { MOCK_JOBS } from '../data/mockJobs';
import './JobBrowser.css';

const DEFAULT_SEARCHES = [
  { query: 'software developer', location: 'India' },
  { query: 'data scientist', location: 'India' },
  { query: 'product manager', location: 'India' },
];

export const JobBrowser = ({ onMatch, onSkip, onNavigateToMatches, currentUser }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('India');
  const [jobIndex, setJobIndex] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);

  const loadJobs = useCallback(async (query, location) => {
    setLoading(true);
    setUsingFallback(false);
    try {
      const result = await ApiService.fetchExternalJobs({ query, location });
      const fetched = result.jobs || [];
      if (fetched.length === 0) throw new Error('No jobs returned');
      setJobs(fetched);
      setJobIndex(0);
    } catch (err) {
      console.warn('Backend unavailable, using mock jobs:', err.message);
      // Filter mock jobs by query if provided
      const q = query.toLowerCase();
      const filtered = q && q !== 'software developer'
        ? MOCK_JOBS.filter(j =>
            j.title.toLowerCase().includes(q) ||
            j.tags.some(t => t.toLowerCase().includes(q)) ||
            j.company.toLowerCase().includes(q)
          )
        : MOCK_JOBS;
      setJobs(filtered.length > 0 ? filtered : MOCK_JOBS);
      setJobIndex(0);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount, load all jobs
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setUsingFallback(false);
      try {
        const results = await Promise.all(
          DEFAULT_SEARCHES.map(s => ApiService.fetchExternalJobs(s))
        );
        const seen = new Set();
        const merged = [];
        for (const r of results) {
          for (const job of (r.jobs || [])) {
            if (!seen.has(job._id)) {
              seen.add(job._id);
              merged.push(job);
            }
          }
        }
        if (merged.length === 0) throw new Error('No jobs from backend');
        setJobs(merged);
        setJobIndex(0);
      } catch (err) {
        console.warn('Backend unavailable, loading all mock jobs:', err.message);
        setJobs(MOCK_JOBS);
        setJobIndex(0);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadJobs(searchQuery || 'software developer', searchLocation || 'India');
  };

  const currentJob = jobs[jobIndex];
  const isComplete = !loading && jobIndex >= jobs.length;

  const handleLike = () => {
    if (currentJob) {
      onMatch(currentJob);
      setJobIndex(i => i + 1);
    }
  };

  const handleDislike = () => {
    onSkip();
    setJobIndex(i => i + 1);
  };

  return (
    <div className="job-browser">
      {/* Search Bar */}
      <div className="job-search-bar">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-inputs">
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text" className="search-input"
                placeholder="Job title or skills (e.g. React Developer)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="search-input-wrap">
              <span className="search-icon">📍</span>
              <input
                type="text" className="search-input"
                placeholder="Location (e.g. Bengaluru, India)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? '⏳ Loading...' : '🚀 Search Jobs'}
            </button>
          </div>
        </form>

        <div className="job-sources-info">
          <span className="source-pill" style={{ background: '#ff6b35' }}>Naukri</span>
          <span className="source-pill" style={{ background: '#0077b5' }}>LinkedIn</span>
          <span className="source-pill" style={{ background: '#2164f3' }}>Indeed</span>
          <span className="source-pill" style={{ background: '#0caa41' }}>Glassdoor</span>
          <span className="source-label">— Jobs from top portals</span>
        </div>

        {usingFallback && (
          <div className="fallback-notice">
            📋 Showing {jobs.length} curated jobs · Start backend server for live jobs
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="external-loading">
          <div className="loading-spinner-small"></div>
          <p>Fetching latest jobs from Naukri, LinkedIn, Indeed, Glassdoor...</p>
        </div>
      )}

      {/* All done */}
      {!loading && isComplete && (
        <div className="job-browser-complete" data-testid="completion-message">
          <div className="complete-card">
            <h2>🎉 All Done!</h2>
            <p>You've reviewed all {jobs.length} job postings.</p>
            <div className="complete-actions">
              <button className="btn btn-primary" onClick={onNavigateToMatches}>
                View Your Matches
              </button>
              <button className="btn btn-secondary-action"
                onClick={() => { setJobs(MOCK_JOBS); setJobIndex(0); }}>
                🔄 Browse Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job card */}
      {!loading && !isComplete && currentJob && (
        <>
          <div className="job-counter">
            Job {jobIndex + 1} of {jobs.length}
            {!usingFallback && <span className="live-badge">🟢 Live</span>}
          </div>
          <JobCard
            job={currentJob}
            onLike={handleLike}
            onDislike={handleDislike}
            currentUser={currentUser}
          />
        </>
      )}
    </div>
  );
};
