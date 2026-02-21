// State Manager for centralized application state

import { StorageService } from '../services/StorageService';

export class StateManager {
  constructor(initialJobs, storage) {
    this.storage = storage;
    this.listeners = [];
    
    // Load persisted data
    const savedMatches = this.storage.loadMatches();
    const savedPosition = this.storage.loadPosition();

    this.state = {
      currentView: 'browser',
      currentJobIndex: savedPosition,
      matches: savedMatches,
      jobs: initialJobs
    };
  }

  getState() {
    return { ...this.state };
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  addMatch(job) {
    const match = {
      job,
      matchedAt: new Date(),
      applied: false
    };

    this.state.matches.push(match);
    this.state.currentJobIndex++;
    
    this.saveState();
    this.notifyListeners();
  }

  skipJob() {
    this.state.currentJobIndex++;
    this.saveState();
    this.notifyListeners();
  }


  markAsApplied(jobId) {
    const match = this.state.matches.find(m => m.job.id === jobId);
    if (match) {
      match.applied = true;
      this.saveState();
      this.notifyListeners();
    }
  }

  undoApply(jobId) {
    const match = this.state.matches.find(m => m.job.id === jobId);
    if (match && match.applied) {
      match.applied = false;
      this.saveState();
      this.notifyListeners();
    }
  }

  switchView(view) {
    this.state.currentView = view;
    this.notifyListeners();
  }

  saveState() {
    this.storage.saveMatches(this.state.matches);
    this.storage.savePosition(this.state.currentJobIndex);
  }

  loadState() {
    return this.getState();
  }
}
