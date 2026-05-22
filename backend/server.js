import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jobRoutes from './routes/jobs.js';
import matchRoutes from './routes/matches.js';
import userRoutes from './routes/users.js';
import externalJobRoutes from './routes/externalJobs.js';
import applyRoutes from './routes/apply.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined');
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5002;

const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];

// Socket.io setup
const io = new Server(httpServer, {
  cors: { origin: ALLOWED_ORIGINS, methods: ['GET', 'POST'], credentials: true },
});

// Track online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('user:join', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    io.emit('users:online', Array.from(onlineUsers.keys()));
    console.log(`👤 User ${userId} joined`);
  });

  socket.on('notification:send', ({ toUserId, notification }) => {
    const targetSocket = onlineUsers.get(toUserId);
    if (targetSocket) {
      io.to(targetSocket).emit('notification:receive', notification);
    }
  });

  socket.on('chat:message', ({ toUserId, message, fromUser }) => {
    const targetSocket = onlineUsers.get(toUserId);
    const msgData = { ...message, fromUser, timestamp: new Date().toISOString() };
    if (targetSocket) {
      io.to(targetSocket).emit('chat:message', msgData);
    }
    socket.emit('chat:message', msgData); // echo to sender
  });

  socket.on('job:liked', ({ userId, jobTitle, company }) => {
    socket.emit('notification:receive', {
      id: Date.now(),
      type: 'match',
      title: 'Job Liked! 🎯',
      message: `You liked ${jobTitle} at ${company}`,
      time: 'Just now',
      read: false,
      icon: '🎯',
    });
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit('users:online', Array.from(onlineUsers.keys()));
    }
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/external-jobs', externalJobRoutes);
app.use('/api/apply', applyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'TINCLO API is running',
    version: '2.0.0',
    features: ['JWT Auth', 'Socket.io', 'Email', 'Admin Panel', 'Recruiter Dashboard'],
    timestamp: new Date().toISOString(),
  });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    httpServer.listen(PORT, () => {
      console.log(`🚀 TINCLO Server running on http://localhost:${PORT}`);
      console.log(`🔌 Socket.io enabled for real-time notifications`);
      console.log(`🔐 Admin Panel: http://localhost:5174/admin/login`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });
