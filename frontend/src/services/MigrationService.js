/**
 * Migration Service
 * Handles one-time migration of localStorage data to MongoDB database
 */

const MIGRATION_COMPLETE_FLAG = 'job-swipe-migration-complete';

/**
 * Migrate matches from localStorage to database
 * @param {string} userId - User ID for creating matches
 * @param {object} apiService - ApiService instance for API calls
 * @param {object} storageService - StorageService instance for localStorage access
 * @returns {Promise<object>} - Migration summary with success and error counts
 */
async function migrateLocalStorageToDatabase(userId, apiService, storageService) {
  // Check if migration already completed
  if (localStorage.getItem(MIGRATION_COMPLETE_FLAG) === 'true') {
    console.log('Migration already completed, skipping...');
    return { success: 0, errors: 0, skipped: true };
  }

  console.log('Starting migration from localStorage to database...');

  // Load matches from localStorage
  const localMatches = storageService.loadMatches();
  
  if (localMatches.length === 0) {
    console.log('No matches found in localStorage, marking migration as complete');
    localStorage.setItem(MIGRATION_COMPLETE_FLAG, 'true');
    return { success: 0, errors: 0, skipped: false };
  }

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  // Migrate each match
  for (const match of localMatches) {
    try {
      // Create match in database (user will be auto-created if needed)
      const createdMatch = await apiService.createMatch(userId, match.job.id);
      
      // If match was marked as applied, update it
      if (match.applied) {
        await apiService.markMatchApplied(createdMatch._id);
      }
      
      successCount++;
      console.log(`Successfully migrated match for job: ${match.job.title}`);
    } catch (error) {
      errorCount++;
      const errorMessage = `Failed to migrate match for job ${match.job.title}: ${error.message}`;
      console.error(errorMessage);
      errors.push(errorMessage);
      // Continue with remaining matches
    }
  }

  // Clear localStorage after migration attempt
  storageService.clear();
  console.log('Cleared localStorage after migration');

  // Set migration complete flag
  localStorage.setItem(MIGRATION_COMPLETE_FLAG, 'true');
  console.log('Migration complete flag set');

  const summary = {
    success: successCount,
    errors: errorCount,
    skipped: false,
    errorDetails: errors
  };

  console.log('Migration summary:', summary);
  return summary;
}

export default {
  migrateLocalStorageToDatabase,
  MIGRATION_COMPLETE_FLAG
};
