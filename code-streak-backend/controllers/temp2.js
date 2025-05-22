// backend/controllers/ProblemController.js
const Problem = require("../models/problem");
const { body, validationResult } = require("express-validator");
const errorView = require("../views/error");

exports.getProblems = async (req, res) => {
  try {
    const problems = await Problem.find({ userId: req.user.id });
    res.json(problems);
  } catch (err) {
    errorView.serverError(res);
  }
};
//hoooo
exports.createProblem = [
  body("title").notEmpty().withMessage("Title is required"),
  body("link").isURL().withMessage("Valid URL is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorView.validationError(res, errors.array());
    }

    try {
      const { title, link, notes, tags } = req.body;
      const problem = new Problem({
        userId: req.user.id,
        title,
        link,
        notes: notes || "",
        tags: tags || [],
      });
      await problem.save();
      res.status(201).json(problem);
    } catch (err) {
      errorView.serverError(res);
    }
  },
];

exports.updateProblem = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("link").optional().isURL().withMessage("Valid URL is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorView.validationError(res, errors.array());
    }

    try {
      const { id } = req.params;
      const updates = req.body;
      const problem = await Problem.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        updates,
        { new: true }
      );
      if (!problem) {
        return errorView.notFound(res, "Problem");
      }
      res.json(problem);
    } catch (err) {
      errorView.serverError(res);
    }
  },
];

exports.deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });
    if (!problem) {
      return errorView.notFound(res, "Problem");
    }
    res.json({ message: "Problem deleted" });
  } catch (err) {
    errorView.serverError(res);
  }
};
