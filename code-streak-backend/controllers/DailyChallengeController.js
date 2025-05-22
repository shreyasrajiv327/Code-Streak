// // backend/controllers/DailyChallengeController.js
// const Problem = require('../models/Problem');
// const DailyChallenge = require('../models/DailyChallenge');
// const errorView = require('../views/error');

// exports.getDailyChallenge = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     let dailyChallenge = await DailyChallenge.findOne({
//       userId: req.user.id,
//       date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
//     }).populate('problemId');

//     if (!dailyChallenge) {
//       const problems = await Problem.find({ userId: req.user.id });
//       if (problems.length === 0) {
//         return errorView.notFound(res, 'Problems');
//       }

//       const randomIndex = Math.floor(Math.random() * problems.length);
//       const selectedProblem = problems[randomIndex];

//       dailyChallenge = new DailyChallenge({
//         userId: req.user.id,
//         problemId: selectedProblem._id,
//         date: today,
//       });
//       await dailyChallenge.save();
//       dailyChallenge = await DailyChallenge.findById(dailyChallenge._id).populate('problemId');
//     }

//     res.json(dailyChallenge);
//   } catch (err) {
//     errorView.serverError(res);
//   }
// };

// exports.markSolved = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const dailyChallenge = await DailyChallenge.findOneAndUpdate(
//       {
//         userId: req.user.id,
//         date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
//       },
//       { solved: true },
//       { new: true }
//     ).populate('problemId');

//     if (!dailyChallenge) {
//       return errorView.notFound(res, 'Daily challenge');
//     }

//     res.json(dailyChallenge);
//   } catch (err) {
//     errorView.serverError(res);
//   }
// };
// controllers/dailyChallengeController.js

const DailyChallenge = require('../models/DailyChallenge');
const Problem = require('../models/Problem');
const moment = require('moment');

exports.getDailyChallenge = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = moment().startOf('day').toDate();

    let challenge = await DailyChallenge.findOne({ userId, date: today }).populate('problemId');

    if (!challenge) {
      const randomProblem = await Problem.aggregate([{ $sample: { size: 1 } }]);
      if (!randomProblem.length) {
        return res.status(404).json({ error: 'No problems available' });
      }

      challenge = new DailyChallenge({
        userId,
        problemId: randomProblem[0]._id,
        date: today,
      });
      await challenge.save();
      await challenge.populate('problemId');
    }

    // Return response in a shape your frontend expects
    res.json({
      _id: challenge._id,
      date: challenge.date,
      solved: challenge.solved,
      problemId: {
        title: challenge.problemId.title,
        link: challenge.problemId.link,
        difficulty: challenge.problemId.difficulty,
      },
    });
  } catch (err) {
    console.error('Error in getDailyChallenge:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Used when user clicks "Mark as Solved"
exports.createChallenge = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = moment().startOf('day').toDate();

    const challenge = await DailyChallenge.findOneAndUpdate(
      { userId, date: today },
      { solved: true },
      { new: true }
    );

    if (!challenge) {
      return res.status(404).json({ error: 'Daily challenge not found' });
    }

    res.json({ message: 'Challenge marked as solved!' });
  } catch (err) {
    console.error('Error in createChallenge:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
