import express from 'express';
import User from '../models/User.js';
import Match from '../models/Match.js';

const router = express.Router();

// POST /api/users — Register a new user (full details)
router.post('/', async (req, res) => {
  const { userId, name, email, password } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  try {
    // Check if email already exists
    if (email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }
    }

    const user = new User({ userId, name: name || '', email: email || '', password: password || '' });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// POST /api/users/login — Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      userId: user.userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users — Get all users (admin view)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/data — Full database summary (admin)
router.get('/data', async (req, res) => {
  try {
    const [users, matches] = await Promise.all([
      User.find().sort({ createdAt: -1 }).select('-password'),
      Match.find().populate('jobId').sort({ matchedAt: -1 })
    ]);

    res.json({
      summary: {
        totalUsers: users.length,
        totalMatches: matches.length,
        appliedMatches: matches.filter(m => m.applied).length
      },
      users,
      matches
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/:userId — Get user by userId
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/users/:userId
router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
