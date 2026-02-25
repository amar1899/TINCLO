
import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { JobBrowser } from './components/JobBrowser';
import { MatchesView } from './components/MatchesView';
import { StateManager } from './state/StateManager';
import { StorageService } from './services/StorageService';
import ApiService from './services/ApiService';
import MigrationService from './services/MigrationService';
import './App.css';

// Generate a temporary userId (in production, this would come from authentication)
const USER_ID = 'user123';

const stateManager = new StateManager(USER_ID, ApiService);

export const App = () => {
  const [state, setState] = useState(stateManager.getState());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [migrationStatus, setMigrationStatus] = useState(null);

  useEffect(() => {
    const unsubscribe = stateManager.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        setError(null);

        // Run migration first
        const storageService = new StorageService();
        const migrationResult = await MigrationService.migrateLocalStorageToDatabase(
          USER_ID,
          ApiService,
          storageService
        );

        if (!migrationResult.skipped) {
          setMigrationStatus(migrationResult);
          console.log('Migration completed:', migrationResult);
        }

        // Load jobs and matches from API
        await stateManager.loadJobs();
        await stateManager.loadMatches();

        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError(err.message || 'Failed to load application data. Please refresh the page.');
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleNavigate = (view) => {
    stateManager.switchView(view);
  };

  const handleMatch = async (job) => {
    try {
      await stateManager.addMatch(job);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleSkip = () => {
    stateManager.skipJob();
  };

  const handleApply = async (jobId) => {
    try {
      await stateManager.markAsApplied(jobId);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleUndoApply = async (jobId) => {
    try {
      await stateManager.undoApply(jobId);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Job Swipe Matcher...</p>
          {migrationStatus && (
            <p className="migration-status">
              Migrating your saved jobs... ({migrationStatus.success} completed)
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error && !state.jobs.length) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>Unable to Load Application</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navigation
        currentView={state.currentView}
        matchCount={state.matches.length}
        onNavigate={handleNavigate}
      />

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {migrationStatus && migrationStatus.success > 0 && (
        <div className="migration-banner">
          Successfully migrated {migrationStatus.success} saved job{migrationStatus.success !== 1 ? 's' : ''} from local storage!
          {migrationStatus.errors > 0 && ` (${migrationStatus.errors} failed)`}
        </div>
      )}

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
 