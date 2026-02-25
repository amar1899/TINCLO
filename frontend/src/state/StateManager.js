// State Manager for centralized application state

import ApiService from '../services/ApiService.js';

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
        location: apiMatch.jobId.location
      },
      matchedAt: new Date(apiMatch.matchedAt),
      applied: apiMatch.applied
    };
  }

  /**
   * Load jobs from API
   * @returns {Promise<void>}
   */
  async loadJobs() {
    try {
      const jobs = await this.apiService.fetchJobs();
      this.state.jobs = jobs.map(job => ({
        id: job._id,
        title: job.title,
        company: job.company,
        description: job.description,
        salary: job.salary,
        location: job.location
      }));
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to load jobs:', error);
      throw new Error('Unable to load job listings. Please try again later.');
    }
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
    } catch (error) {
      console.error('Failed to load matches:', error);
      throw new Error('Unable to load your saved jobs. Please try again later.');
    }
  }

  /**
   * Add a match (user likes a job)
   * @param {object} job - Job object to match
   * @returns {Promise<void>}
   */
  async addMatch(job) {
    try {
      const apiMatch = await this.apiService.createMatch(this.userId, job.id);
      const normalizedMatch = this.normalizeMatch(apiMatch);
      
      this.state.matches.push(normalizedMatch);
      this.state.currentJobIndex++;
      
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to add match:', error);
      if (error.message.includes('Already matched')) {
        throw new Error('You have already saved this job.');
      }
      throw new Error('Unable to save job. Please try again.');
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
    try {
      const apiMatch = await this.apiService.markMatchApplied(matchId);
      const normalizedMatch = this.normalizeMatch(apiMatch);
      
      const index = this.state.matches.findIndex(m => m.id === matchId);
      if (index !== -1) {
        this.state.matches[index] = normalizedMatch;
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to mark as applied:', error);
      throw new Error('Unable to update application status. Please try again.');
    }
  }

  /**
   * Undo apply status (mark as not applied)
   * @param {string} matchId - Match ID (MongoDB _id)
   * @returns {Promise<void>}
   */
  async undoApply(matchId) {
    // Note: This would require a new API endpoint to set applied=false
    // For now, we'll update locally only
    const match = this.state.matches.find(m => m.id === matchId);
    if (match && match.applied) {
      match.applied = false;
      this.notifyListeners();
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
