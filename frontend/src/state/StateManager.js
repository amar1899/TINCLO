// State Manager for centralized application state

import ApiService from '../services/ApiService.js';
import { sampleJobs } from '../data/sampleJobs.js';

export class StateManager {
  constructor(userId, apiService = ApiService) {
    this.userId = userId;
    this.apiService = apiService;
    this.listeners = [];

    this.state = {
      currentView: 'browser',
      currentJobIndex: 0,
      matches: [],
      jobs: []
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

  /**
   * Normalize API match response to internal match structure
   * @param {object} apiMatch - Match object from API with populated jobId
   * @returns {object} - Normalized match object
   */
  normalizeMatch(apiMatch) {
    return {
      id: apiMatch._id,
      job: {
        id: apiMatch.jobId._id,
        title: apiMatch.jobId.title,
        company: apiMatch.jobId.company,
        description: apiMatch.jobId.description,
        salary: apiMatch.jobId.salary,
        location: apiMatch.jobId.location,
        applyUrl: apiMatch.jobId.applyUrl || null,
        source: apiMatch.jobId.source || null,
        isExternal: apiMatch.jobId.isExternal || false,
        tags: apiMatch.jobId.tags || []
      },
      matchedAt: new Date(apiMatch.matchedAt),
      applied: apiMatch.applied
    };
  }

  /**
   * Load jobs from API — skipped, all jobs come from external portals (Naukri, LinkedIn, Indeed, Glassdoor)
   * @returns {Promise<void>}
   */
  async loadJobs() {
    // DB jobs are no longer shown — only live external jobs are displayed in JobBrowser
    this.state.jobs = [];
    this.notifyListeners();
  }

  /**
   * Load matches from API
   * @returns {Promise<void>}
   */
  async loadMatches() {
    try {
      const apiMatches = await this.apiService.fetchUserMatches(this.userId);
      this.state.matches = apiMatches.map(match => this.normalizeMatch(match));
      this.notifyListeners();
      console.log('✅ Loaded matches from API');
    } catch (error) {
      console.warn('⚠️ API unavailable, starting with empty matches:', error.message);
      // Fallback to empty matches when API is unavailable
      this.state.matches = [];
      this.notifyListeners();
    }
  }

  /**
   * Add a match (user likes a job)
   * @param {object} job - Job object to match
   * @returns {Promise<void>}
   */
  async addMatch(job) {
    // Optimistically add to local state immediately for better UX
    const localMatch = {
      id: `local-${Date.now()}`,
      job: {
        id: job.id || job._id,
        title: job.title,
        company: job.company,
        description: job.description,
        salary: job.salary,
        location: job.location,
        applyUrl: job.applyUrl || null,
        source: job.source || null,
        isExternal: job.isExternal || false,
        tags: job.tags || []
      },
      matchedAt: new Date(),
      applied: false
    };
    
    this.state.matches.push(localMatch);
    this.state.currentJobIndex++;
    this.notifyListeners();

    // Try to sync with API (will fail with SQL interface, but that's okay)
    try {
      const apiMatch = await this.apiService.createMatch(this.userId, job.id);
      const normalizedMatch = this.normalizeMatch(apiMatch);
      
      // Replace local match with API match
      const index = this.state.matches.findIndex(m => m.id === localMatch.id);
      if (index !== -1) {
        this.state.matches[index] = normalizedMatch;
        this.notifyListeners();
      }
      console.log('Successfully synced with API');
    } catch (error) {
      // API failed (expected with SQL interface), but local update already succeeded
      console.warn('API sync failed, keeping local match:', error.message);
      
      // Check for duplicate error
      if (error.message.includes('Already matched')) {
        // Remove the local match we just added
        this.state.matches = this.state.matches.filter(m => m.id !== localMatch.id);
        this.state.currentJobIndex--;
        this.notifyListeners();
        throw new Error('You have already saved this job.');
      }
      // For other errors, keep the local match - don't throw
    }
  }

  skipJob() {
    this.state.currentJobIndex++;
    this.notifyListeners();
  }

  /**
   * Mark a match as applied
   * @param {string} matchId - Match ID (MongoDB _id)
   * @returns {Promise<void>}
   */
  async markAsApplied(matchId) {
    // First, try to update locally immediately for better UX
    const index = this.state.matches.findIndex(m => m.id === matchId);
    if (index === -1) {
      console.error('Match not found:', matchId);
      return;
    }

    // Optimistically update the UI
    const previousState = this.state.matches[index].applied;
    this.state.matches[index].applied = true;
    this.notifyListeners();

    // Try to sync with API (will fail with SQL interface, but that's okay)
    try {
      const apiMatch = await this.apiService.markMatchApplied(matchId);
      const normalizedMatch = this.normalizeMatch(apiMatch);
      this.state.matches[index] = normalizedMatch;
      this.notifyListeners();
      console.log('Successfully synced with API');
    } catch (error) {
      // API failed (expected with SQL interface), but local update already succeeded
      console.warn('API sync failed, keeping local update:', error.message);
      // Don't revert the change or throw an error - the local update is sufficient
    }
  }

  /**
   * Undo apply status (mark as not applied)
   * @param {string} matchId - Match ID (MongoDB _id)
   * @returns {Promise<void>}
   */
  async undoApply(matchId) {
    // Update locally (API endpoint for undo doesn't exist yet)
    const match = this.state.matches.find(m => m.id === matchId);
    if (match && match.applied) {
      match.applied = false;
      this.notifyListeners();
      console.warn('Application status updated locally only.');
    }
  }

  /**
   * Delete a match (user unlikes a job)
   * @param {string} matchId - Match ID (MongoDB _id)
   * @returns {Promise<void>}
   */
  async deleteMatch(matchId) {
    try {
      await this.apiService.deleteMatch(matchId);
      
      this.state.matches = this.state.matches.filter(m => m.id !== matchId);
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to delete match:', error);
      throw new Error('Unable to remove saved job. Please try again.');
    }
  }

  switchView(view) {
    this.state.currentView = view;
    this.notifyListeners();
  }
}
