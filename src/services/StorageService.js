// Storage Service for persisting data to localStorage

export class StorageService {
  constructor() {
    this.MATCHES_KEY = 'job-swipe-matches';
    this.POSITION_KEY = 'job-swipe-position';
  }

  saveMatches(matches) {
    try {
      const serialized = JSON.stringify(matches);
      localStorage.setItem(this.MATCHES_KEY, serialized);
    } catch (error) {
      console.error('Failed to save matches:', error);
    }
  }

  loadMatches() {
    try {
      const serialized = localStorage.getItem(this.MATCHES_KEY);
      if (!serialized) return [];
      
      const parsed = JSON.parse(serialized);
      // Convert matchedAt strings back to Date objects
      return parsed.map((match) => ({
        ...match,
        matchedAt: new Date(match.matchedAt)
      }));
    } catch (error) {
      console.error('Failed to load matches:', error);
      return [];
    }
  }

  savePosition(index) {
    try {
      localStorage.setItem(this.POSITION_KEY, index.toString());
    } catch (error) {
      console.error('Failed to save position:', error);
    }
  }

  loadPosition() {
    try {
      const position = localStorage.getItem(this.POSITION_KEY);
      return position ? parseInt(position, 10) : 0;
    } catch (error) {
      console.error('Failed to load position:', error);
      return 0;
    }
  }

  clear() {
    try {
      localStorage.removeItem(this.MATCHES_KEY);
      localStorage.removeItem(this.POSITION_KEY);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}
