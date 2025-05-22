const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getDailyChallenge, createChallenge } = require('../controllers/dailyChallengeController');

// Fetch today's daily challenge
router.get('/', auth, getDailyChallenge);

// Mark today's challenge as solved
router.post('/solve', auth, createChallenge);

module.exports = router;