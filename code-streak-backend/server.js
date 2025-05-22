// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/database');
// const passport = require('passport');
// require('./config/passport');

// const authRoutes = require('./routes/authRoutes');
// const problemRoutes = require('./routes/problemRoutes');
// const dailyChallengeRoutes = require('./routes/dailyChallengeRoutes');
// const streakRoutes = require('./routes/streak');

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
// app.use(express.json());
// app.use(passport.initialize());

// // Routes
// app.use('/auth', authRoutes);
// app.use('/api/problems', problemRoutes);
// app.use('/api/daily-challenge', dailyChallengeRoutes);
// app.use('/api/streaks', streakRoutes);

// // Error handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const passport = require('passport');
require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const dailyChallengeRoutes = require('./routes/dailyChallengeRoutes');
const streakRoutes = require('./routes/streak');
const bookmarkRoutes = require('./routes/bookmarks'); // Add this line

const app = express();

// Connect to MongoDB
connectDB();
app.set('trust proxy', 1);
// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/daily-challenge', dailyChallengeRoutes);
app.use('/api/streaks', streakRoutes);
app.use('/api/bookmarks', bookmarkRoutes); // Mount bookmark routes here

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// app.use(cors({
//   origin: ['https://yourfrontend.com', 'http://localhost:5173'], // allow deployed frontend + local dev
//   credentials: true, // if you use cookies or auth headers
// }));

app.use(cors({
  origin: process.env.FRONTEND_URL,  // frontend URL with https
  credentials: true,
}));
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
