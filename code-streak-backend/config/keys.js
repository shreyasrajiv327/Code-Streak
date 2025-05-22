// // backend/config/keys.js
// require('dotenv').config();

// module.exports = {
//   mongoURI: process.env.MONGO_URI,
//   googleClientID: process.env.GOOGLE_CLIENT_ID,
//   googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   jwtSecret: process.env.JWT_SECRET,
//   frontendURL: process.env.FRONTEND_URL,
// };

// backend/config/keys.js
require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackURL: process.env.GOOGLE_CALLBACK_URL,  // <-- add this line
  jwtSecret: process.env.JWT_SECRET,
  frontendURL: process.env.FRONTEND_URL,
};
