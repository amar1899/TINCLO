// MatchesView Component - Displays all matched jobs


import React, { useState } from 'react';
import './MatchesView.css';

export const MatchesView = ({ matches, onApply, onUndoApply, onNavigateToBrowser }) => {
  const [selectedMatchId, setSelectedMatchId] = useState(null);

  if (matches.length === 0) {
    return (
      <div className="matches-empty" data-testid="empty-matches">
        <div className="empty-card">
          <h2>No Matches Yet</h2>
          <p>Start browsing jobs and like the ones you're interested in!</p>
          <button
            className="btn btn-primary"
            onClick={onNavigateToBrowser}
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  const selectedMatch = selectedMatchId
    ? matches.find(m => m.job.id === selectedMatchId)
    : null;

  return (
    <div className="matches-view">
      <div className="matches-header">
        <h2>Your Matches ({matches.length})</h2>
      </div>

      <div className="matches-list">
        {matches.map((match) => (
          <div
            key={match.job.id}
            className={`match-item ${match.applied ? 'applied' : ''} ${
              selectedMatchId === match.job.id ? 'selected' : ''
            }`}
            onClick={() => setSelectedMatchId(match.job.id)}
            data-testid="match-item"
          >
            <div className="match-info">
              <h3 className="match-title">{match.job.title}</h3>
              <p className="match-company">{match.job.company}</p>
              <p className="match-location">{match.job.location}</p>
            </div>
            
            <div className="match-actions">
              {match.applied ? (
                <>
                  <span className="applied-badge">✓ Applied</span>
                  <button
                    className="btn btn-undo"
                    style={{marginLeft: '0.5rem'}}
                    onClick={e => {
                      e.stopPropagation();
                      onUndoApply(match.id);
                    }}
                  >Undo</button>
                </>
              ) : (
                <button
                  className="btn btn-apply"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply(match.id);
                  }}
                >
                  Apply
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedMatch && (
        <div className="match-details" data-testid="match-details">
          <h3>Job Details</h3>
          <div className="detail-section">
            <h4>{selectedMatch.job.title}</h4>
            <p className="detail-company">{selectedMatch.job.company}</p>
            <div className="detail-info">
              <span><strong>Location:</strong> {selectedMatch.job.location}</span>
              <span><strong>Salary:</strong> {selectedMatch.job.salary}</span>
            </div>
            <div className="detail-description">
              <strong>Description:</strong>
              <p>{selectedMatch.job.description}</p>
            </div>
            <div className="detail-meta">
              <small>Matched on: {selectedMatch.matchedAt.toLocaleDateString()}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
