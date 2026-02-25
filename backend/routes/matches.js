import express from 'express';
import Match from '../models/Match.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

const router = express.Router();

// GET all matches for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const matches = await Match.find({ userId: req.params.userId })
      .populate('jobId')
      .sort({ matchedAt: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new match (like a job)
router.post('/', async (req, res) => {
  // Validate user exists
  try {
    const user = await User.findOne({ userId: req.body.userId });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please create user first.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error validating user: ' + error.message });
  }

  const match = new Match({
    userId: req.body.userId,
    jobId: req.body.jobId,
    applied: false
  });

  try {
    const newMatch = await match.save();
    const populatedMatch = await Match.findById(newMatch._id).populate('jobId');
    res.status(201).json(populatedMatch);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already matched with this job' });
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT mark match as applied
router.put('/:id/apply', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    match.applied = true;
    await match.save();
    
    const populatedMatch = await Match.findById(match._id).populate('jobId');
    res.json(populatedMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE unmatch a job
router.delete('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    await match.deleteOne();
    res.json({ message: 'Match deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
