require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://ecoquest-1-0be0.onrender.com', 
  credentials: true
}));
app.use(cookieParser());

// Basic test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EcoQuest API is running' });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const apiRoutes = require('./routes/apiRoutes'); // Contains Leaderboard & Admin

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/leaderboard', apiRoutes); // Prefix handles leaderboard/students, leaderboard/schools
app.use('/api', apiRoutes); // For /api/admin/...

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecoquest')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
