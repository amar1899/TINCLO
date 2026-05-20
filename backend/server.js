import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jobRoutes from './routes/jobs.js';
import matchRoutes from './routes/matches.js';
import userRoutes from './routes/users.js';
import externalJobRoutes from './routes/externalJobs.js';
import applyRoutes from './routes/apply.js';

dotenv.config();

// Validate required environment variables
if (!process.env.MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not defined in environment variables');
  console.error('Please create a .env file with MONGODB_URI or set it in your environment');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/external-jobs', externalJobRoutes);
app.use('/api/apply', applyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    
    // Start server only after successful database connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Failed to connect to database. Server will not start.');
    process.exit(1);
  });
