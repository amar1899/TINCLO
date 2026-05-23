/**
 * Use Cases Data Structure
 * 
 * Defines the use case scenarios displayed in the use cases section.
 * Each use case includes title, headline, description, image, and features.
 * 
 * Requirements: 2.4
 */
const useCasesData = [
  {
    id: 'recent-graduates',
    title: 'Recent Graduates',
    headline: 'Launch Your Career with Confidence',
    description: 'Navigate the job market with tools designed for first-time job seekers. Build your profile, discover entry-level opportunities, and track your applications all in one place.',
    image: '/assets/recent-graduates.svg',
    features: ['Resume builder', 'Interview prep tips', 'Entry-level focus']
  },
  {
    id: 'career-changers',
    title: 'Career Changers',
    headline: 'Discover New Opportunities in Your Field',
    description: 'Transitioning to a new career? TINCLO helps you find roles that match your transferable skills and interests. Get personalized recommendations based on your unique background.',
    image: '/assets/career-changers.svg',
    features: ['Skills matching', 'Industry insights', 'Career path guidance']
  },
  {
    id: 'active-job-seekers',
    title: 'Active Job Seekers',
    headline: 'Manage Multiple Applications Effortlessly',
    description: 'Stay on top of your job search with powerful organization tools. Track application status, save favorites, and never miss an opportunity with our intuitive dashboard.',
    image: '/assets/active-job-seekers.svg',
    features: ['Application tracking', 'Status updates', 'Saved jobs']
  }
];

export default useCasesData;
