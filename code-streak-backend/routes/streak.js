const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Streak = require('../models/Streaks');

// Get user's streak data
router.get('/', auth, async (req, res) => {
  try {
    const streaks = await Streak.find({ userId: req.user.id });
    res.json(streaks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Record a daily problem solve
router.post('/solve', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    // Check if there's already a record for today
    let streak = await Streak.findOne({ userId: req.user.id, date: today });

    if (streak) {
      // Update existing record
      streak.solved = true;
      await streak.save();
    } else {
      // Create new record
      streak = new Streak({
        userId: req.user.id,
        date: today,
        solved: true,
      });
      await streak.save();
    }

    res.json(streak);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;