// backend/routes/problemRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const ProblemController = require('../controllers/problemController');

router.get('/', authMiddleware, ProblemController.getProblems);
router.post('/', authMiddleware, ProblemController.createProblem);
router.put('/:id', authMiddleware, ProblemController.updateProblem);
router.delete('/:id', authMiddleware, ProblemController.deleteProblem);

module.exports = router;