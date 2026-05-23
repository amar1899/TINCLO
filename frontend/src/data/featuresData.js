/**
 * Features Data Structure for Landing Page
 * 
 * This file defines the feature categories and items for the tabbed features section.
 * Each category contains multiple feature items with title, description, icon, and screenshot.
 * 
 * Requirements: 3.4
 */

const featuresData = {
  'job-matching': {
    title: 'Smart Job Matching',
    items: [
      {
        id: 'swipe-interface',
        title: 'Intuitive Swipe Interface',
        description: 'Browse jobs with familiar swipe gestures. Swipe right to save opportunities, left to pass. It\'s as easy as your favorite apps.',
        icon: '👍',
        screenshot: '/assets/swipe-demo.svg'
      },
      {
        id: 'smart-recommendations',
        title: 'AI-Powered Recommendations',
        description: 'Our intelligent algorithm learns from your preferences and matches you with jobs that fit your skills, experience, and career goals.',
        icon: '🎯',
        screenshot: '/assets/recommendations-demo.svg'
      },
      {
        id: 'instant-matching',
        title: 'Instant Match Notifications',
        description: 'Get notified immediately when you match with an employer. Stay ahead of the competition with real-time updates.',
        icon: '⚡',
        screenshot: '/assets/notifications-demo.svg'
      }
    ]
  },
  'application-tracking': {
    title: 'Application Management',
    items: [
      {
        id: 'status-tracking',
        title: 'Application Status Tracking',
        description: 'Keep track of all your applications in one place. See which jobs you\'ve applied to, which are under review, and which have responded.',
        icon: '📊',
        screenshot: '/assets/status-tracking-demo.svg'
      },
      {
        id: 'saved-jobs',
        title: 'Saved Jobs Collection',
        description: 'Build your personal collection of interesting opportunities. Save jobs to review later and never lose track of promising positions.',
        icon: '💾',
        screenshot: '/assets/saved-jobs-demo.svg'
      },
      {
        id: 'application-history',
        title: 'Complete Application History',
        description: 'Access your full application history with detailed timelines. Review past applications and learn from your job search journey.',
        icon: '📝',
        screenshot: '/assets/history-demo.svg'
      }
    ]
  },
  'profile-management': {
    title: 'Profile & Preferences',
    items: [
      {
        id: 'skills-profile',
        title: 'Skills & Experience Profile',
        description: 'Create a comprehensive profile showcasing your skills, experience, and achievements. Let employers see what makes you unique.',
        icon: '🎓',
        screenshot: '/assets/profile-demo.svg'
      },
      {
        id: 'job-preferences',
        title: 'Job Preferences Setup',
        description: 'Set your preferences for job type, location, salary range, and work environment. Get matched with opportunities that meet your criteria.',
        icon: '⚙️',
        screenshot: '/assets/preferences-demo.svg'
      },
      {
        id: 'resume-builder',
        title: 'Integrated Resume Builder',
        description: 'Build and maintain your professional resume directly in the app. Export in multiple formats and keep it always up to date.',
        icon: '📄',
        screenshot: '/assets/resume-demo.svg'
      }
    ]
  }
};

export default featuresData;
