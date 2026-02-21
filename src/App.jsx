
import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { JobBrowser } from './components/JobBrowser';
import { MatchesView } from './components/MatchesView';
import { StateManager } from './state/StateManager';
import { StorageService } from './services/StorageService';
import { sampleJobs } from './data/sampleJobs';
import './App.css';

const storage = new StorageService();
const stateManager = new StateManager(sampleJobs, storage);

export const App = () => {
  const [state, setState] = useState(stateManager.getState());

  useEffect(() => {
    const unsubscribe = stateManager.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  const handleNavigate = (view) => {
    stateManager.switchView(view);
  };

  const handleMatch = (job) => {
    stateManager.addMatch(job);
  };

  const handleSkip = () => {
    stateManager.skipJob();
  };

  const handleApply = (jobId) => {
    stateManager.markAsApplied(jobId);
  };

  const handleUndoApply = (jobId) => {
    stateManager.undoApply(jobId);
  };

  return (
    <div className="app">
      <Navigation
        currentView={state.currentView}
        matchCount={state.matches.length}
        onNavigate={handleNavigate}
      />

      <main className="app-main">
        {state.currentView === 'browser' ? (
          <JobBrowser
            jobs={state.jobs}
            currentIndex={state.currentJobIndex}
            onMatch={handleMatch}
            onSkip={handleSkip}
            onNavigateToMatches={() => handleNavigate('matches')}
          />
        ) : (
          <MatchesView
            matches={state.matches}
            onApply={handleApply}
            onUndoApply={handleUndoApply}
            onNavigateToBrowser={() => handleNavigate('browser')}
          />
        )}
      </main>
    </div>
  );
};
 