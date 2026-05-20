import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job.js';

dotenv.config();

const sampleJobs = [
  {
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    description: 'We are looking for an experienced frontend developer to join our team. You will work on building modern web applications using React, TypeScript, and other cutting-edge technologies.',
    salary: '$120,000 - $150,000',
    location: 'San Francisco, CA',
    source: 'LinkedIn',
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=Senior+Frontend+Developer+TechCorp',
    tags: ['React', 'TypeScript', 'Remote Friendly']
  },
  {
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    description: 'Join our fast-growing startup as a full stack engineer. Work on both frontend and backend systems, collaborate with a talented team, and help shape our product.',
    salary: '$100,000 - $130,000',
    location: 'Remote',
    source: 'Indeed',
    applyUrl: 'https://in.indeed.com/jobs?q=Full+Stack+Engineer+StartupXYZ',
    tags: ['Node.js', 'React', 'Remote']
  },
  {
    title: 'UX/UI Designer',
    company: 'Design Studio',
    description: 'Create beautiful and intuitive user experiences for our clients. Work with cross-functional teams to design web and mobile applications.',
    salary: '$90,000 - $110,000',
    location: 'New York, NY',
    source: 'Naukri',
    applyUrl: 'https://www.naukri.com/ux-ui-designer-jobs',
    tags: ['Figma', 'Adobe XD', 'UI/UX']
  },
  {
    title: 'Backend Developer',
    company: 'CloudSystems',
    description: 'Build scalable backend services and APIs. Work with Node.js, PostgreSQL, and AWS to create robust systems that power our platform.',
    salary: '$110,000 - $140,000',
    location: 'Austin, TX',
    source: 'LinkedIn',
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=Backend+Developer+CloudSystems',
    tags: ['Node.js', 'PostgreSQL', 'AWS']
  },
  {
    title: 'DevOps Engineer',
    company: 'InfraTech',
    description: 'Manage and optimize our cloud infrastructure. Implement CI/CD pipelines, monitor system performance, and ensure high availability.',
    salary: '$115,000 - $145,000',
    location: 'Seattle, WA',
    source: 'Indeed',
    applyUrl: 'https://in.indeed.com/jobs?q=DevOps+Engineer+InfraTech',
    tags: ['AWS', 'Docker', 'Kubernetes']
  },
  {
    title: 'Product Manager',
    company: 'ProductCo',
    description: 'Lead product strategy and roadmap. Work closely with engineering, design, and business teams to deliver exceptional products.',
    salary: '$130,000 - $160,000',
    location: 'Boston, MA',
    source: 'Glassdoor',
    applyUrl: 'https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=Product+Manager+ProductCo',
    tags: ['Product Strategy', 'Agile', 'Roadmap']
  },
  {
    title: 'Data Scientist',
    company: 'DataLabs',
    description: 'Analyze large datasets and build machine learning models. Help drive data-driven decision making across the organization.',
    salary: '$125,000 - $155,000',
    location: 'Remote',
    source: 'Naukri',
    applyUrl: 'https://www.naukri.com/data-scientist-jobs',
    tags: ['Python', 'Machine Learning', 'Remote']
  },
  {
    title: 'Mobile Developer',
    company: 'AppWorks',
    description: 'Develop native mobile applications for iOS and Android. Create smooth, performant apps that delight our users.',
    salary: '$105,000 - $135,000',
    location: 'Los Angeles, CA',
    source: 'LinkedIn',
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=Mobile+Developer+AppWorks',
    tags: ['iOS', 'Android', 'React Native']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('🗑️  Cleared existing jobs');

    // Insert sample jobs
    const jobs = await Job.insertMany(sampleJobs);
    console.log(`✅ Inserted ${jobs.length} sample jobs`);

    await mongoose.connection.close();
    console.log('👋 Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
