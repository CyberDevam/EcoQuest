const express = require('express');
const router = express.Router();
const { getStudentDashboard, getLessons, submitQuiz, submitChallenge } = require('../controllers/studentController');
const { verifyToken, isStudent } = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, isStudent, getStudentDashboard);
router.get('/lessons', verifyToken, isStudent, getLessons);
router.post('/submit-quiz', verifyToken, isStudent, submitQuiz);
router.post('/submit-challenge', verifyToken, isStudent, submitChallenge);

module.exports = router;
