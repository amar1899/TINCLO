/**
 * API Service Layer
 * Handles all communication with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Base fetch wrapper with error handling
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - Parsed JSON response
 * @throws {Error} - Descriptive error for network or HTTP failures
 */
async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error: Unable to connect to server');
    }
    throw error;
  }
}

const ApiService = {
  // Configuration
  getBaseUrl: () => API_BASE_URL,

  // Job API methods
  /**
   * Fetch all job listings
   * @returns {Promise<Array>} - Array of job objects
   * @throws {Error} - Network or HTTP error
   */
  async fetchJobs() {
    return await apiFetch('/jobs');
  },

  /**
   * Fetch a single job by ID
   * @param {string} jobId - Job ID
   * @returns {Promise<object>} - Job object
   * @throws {Error} - Network or HTTP error (404 if not found)
   */
  async fetchJob(jobId) {
    return await apiFetch(`/jobs/${jobId}`);
  },

  // Match API methods
  /**
   * Fetch all matches for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of match objects with populated job details
   * @throws {Error} - Network or HTTP error
   */
  async fetchUserMatches(userId) {
    return await apiFetch(`/matches/user/${userId}`);
  },

  /**
   * Create a new match (user likes a job)
   * @param {string} userId - User ID
   * @param {string} jobId - Job ID
   * @returns {Promise<object>} - Created match object with populated job details
   * @throws {Error} - Network or HTTP error (400 if duplicate)
   */
  async createMatch(userId, jobId) {
    // Ensure user exists before creating match
    await this.ensureUserExists(userId);
    
    return await apiFetch('/matches', {
      method: 'POST',
      body: JSON.stringify({ userId, jobId }),
    });
  },

  /**
   * Mark a match as applied
   * @param {string} matchId - Match ID
   * @returns {Promise<object>} - Updated match object with populated job details
   * @throws {Error} - Network or HTTP error (404 if not found)
   */
  async markMatchApplied(matchId) {
    return await apiFetch(`/matches/${matchId}/apply`, {
      method: 'PUT',
    });
  },

  /**
   * Delete a match (user unlikes a job)
   * @param {string} matchId - Match ID
   * @returns {Promise<object>} - Success message
   * @throws {Error} - Network or HTTP error (404 if not found)
   */
  async deleteMatch(matchId) {
    return await apiFetch(`/matches/${matchId}`, {
      method: 'DELETE',
    });
  },

  // User API methods
  /**
   * Create a new user
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Created user object
   * @throws {Error} - Network or HTTP error (400 if duplicate)
   */
  async createUser(userId) {
    return await apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  /**
   * Fetch a user by userId
   * @param {string} userId - User ID
   * @returns {Promise<object>} - User object
   * @throws {Error} - Network or HTTP error (404 if not found)
   */
  async fetchUser(userId) {
    return await apiFetch(`/users/${userId}`);
  },

  /**
   * Ensure user exists, create if not
   * @param {string} userId - User ID
   * @returns {Promise<object>} - User object
   * @throws {Error} - Network or HTTP error
   */
  async ensureUserExists(userId) {
    try {
      // Try to fetch user
      return await this.fetchUser(userId);
    } catch (error) {
      // If user not found (404), create it
      if (error.message.includes('404') || error.message.includes('not found')) {
        return await this.createUser(userId);
      }
      // Re-throw other errors
      throw error;
    }
  },

  // Health check
  /**
   * Check backend service health
   * @returns {Promise<object>} - Health status object
   * @throws {Error} - Network or HTTP error
   */
  async checkHealth() {
    return await apiFetch('/health');
  },
};

export default ApiService;
