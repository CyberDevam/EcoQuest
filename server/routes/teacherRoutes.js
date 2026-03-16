const express = require('express');
const router = express.Router();
const { createLesson, createChallenge, getSubmissions, reviewSubmission } = require('../controllers/teacherController');
const { verifyToken, isTeacherOrAdmin } = require('../middleware/authMiddleware');

router.post('/create-lesson', verifyToken, isTeacherOrAdmin, createLesson);
router.post('/create-challenge', verifyToken, isTeacherOrAdmin, createChallenge);
router.get('/submissions', verifyToken, isTeacherOrAdmin, getSubmissions);
router.put('/review-submission', verifyToken, isTeacherOrAdmin, reviewSubmission);

module.exports = router;
