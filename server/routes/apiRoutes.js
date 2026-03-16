const express = require('express');
const router = express.Router();
const { getStudentLeaderboard, getSchoolLeaderboard } = require('../controllers/leaderboardController');
const { getUsers, deleteUser, getAnalytics } = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Leaderboard Routes
router.get('/students', getStudentLeaderboard);
router.get('/schools', getSchoolLeaderboard);

// Admin Routes
router.get('/admin/users', verifyToken, isAdmin, getUsers);
router.delete('/admin/user/:id', verifyToken, isAdmin, deleteUser);
router.get('/admin/analytics', verifyToken, isAdmin, getAnalytics);

module.exports = router;
