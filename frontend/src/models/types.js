// Data Models for Job Swipe Matcher

// Validation functions
export function validateJobPosting(job) {
  return (
    typeof job === 'object' &&
    typeof job.id === 'string' && job.id.length > 0 &&
    typeof job.title === 'string' && job.title.length > 0 &&
    typeof job.company === 'string' && job.company.length > 0 &&
    typeof job.description === 'string' && job.description.length > 0 &&
    typeof job.salary === 'string' && job.salary.length > 0 &&
    typeof job.location === 'string' && job.location.length > 0
  );
}

export function validateMatch(match) {
  return (
    typeof match === 'object' &&
    validateJobPosting(match.job) &&
    match.matchedAt instanceof Date &&
    typeof match.applied === 'boolean'
  );
}

export function validateAppState(state) {
  return (
    typeof state === 'object' &&
    (state.currentView === 'browser' || state.currentView === 'matches') &&
    typeof state.currentJobIndex === 'number' &&
    state.currentJobIndex >= 0 &&
    Array.isArray(state.matches) &&
    Array.isArray(state.jobs)
  );
}
