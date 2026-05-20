import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { JobBrowser } from './components/JobBrowser';
import { MatchesView } from './components/MatchesView';
import { StateManager } from './state/StateManager';
import { StorageService } from './services/StorageService';
import ApiService from './services/ApiService';
import MigrationService from './services/MigrationService';
import './App.css';

// Check if user is logged in
const getCurrentUser = () => {
  const currentUser = localStorage.getItem('tinclo_current_user');
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser);
      return user;
    } catch (e) {
      console.error('Error parsing current user:', e);
    }
  }
  return null;
};

export const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [stateManager] = useState(() => {
    const user = getCurrentUser();
    return new StateManager(user ? user.id : 'guest', ApiService);
  });
  const [state, setState] = useState(stateManager.getState());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsubscribe = stateManager.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, [stateManager]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        setError(null);

        const user = getCurrentUser();
        
        if (user) {
          // Run migration first
          const storageService = new StorageService();
          const migrationResult = await MigrationService.migrateLocalStorageToDatabase(
            user.id,
            ApiService,
            storageService
          );

          if (!migrationResult.skipped) {
            setMigrationStatus(migrationResult);
            console.log('Migration completed:', migrationResult);
          }

          // Load matches from API
          await stateManager.loadMatches();
        }

        // Load jobs from API (available to everyone)
        await stateManager.loadJobs();

        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError(err.message || 'Failed to load application data. Please refresh the page.');
        setLoading(false);
      }
    };

    initializeApp();
  }, [stateManager]);

  const handleNavigate = (view) => {
    stateManager.switchView(view);
  };

  const handleMatch = async (job) => {
    // Check if user is logged in
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

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
    // Check if user is logged in
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

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

  const handleLogout = () => {
    localStorage.removeItem('tinclo_current_user');
    setCurrentUser(null);
    navigate('/');
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
        currentUser={currentUser}
        onLogout={handleLogout}
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

      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAuthModal(false)}>×</button>
            <h2>Sign Up Required</h2>
            <p>You need to create an account to like jobs and apply for positions.</p>
            <div className="modal-actions">
              <button 
                className="btn-primary" 
                onClick={() => navigate('/signup')}
              >
                Create Account
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            </div>
            <p className="modal-footer">
              Browse jobs freely, but sign up to save your favorites!
            </p>
          </div>
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
            isAuthenticated={!!currentUser}
            currentUser={currentUser}
          />
        ) : (
          <MatchesView
            matches={state.matches}
            onApply={handleApply}
            onUndoApply={handleUndoApply}
            onNavigateToBrowser={() => handleNavigate('browser')}
            isAuthenticated={!!currentUser}
            currentUser={currentUser}
          />
        )}
      </main>
    </div>
  );
};