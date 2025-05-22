// // backend/middleware/auth.js
// const jwt = require('jsonwebtoken');
// const keys = require('../config/keys');

// module.exports = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     const errorView = require('../views/error');
//     return errorView.unauthorized(res);
//   }

//   try {
//     const decoded = jwt.verify(token, keys.jwtSecret);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     const errorView = require('../views/error');
//     errorView.unauthorized(res);
//   }
// };
// middleware/auth.js
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) throw new Error('User not found');
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
