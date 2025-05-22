// backend/controllers/AuthController.js
const passport = require('passport');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const errorView = require('../views/error');
//hii
exports.googleAuth = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${keys.frontendURL}/login?error=auth_failed`);
    }

    const token = jwt.sign({ id: user._id }, keys.jwtSecret, { expiresIn: '1h' });
    res.redirect(`${keys.frontendURL}/auth/callback?token=${token}`);
  })(req, res, next);
};

exports.getUser = (req, res) => {
  if (!req.user) {
    return errorView.unauthorized(res);
  }
  res.json({ user: req.user });
};