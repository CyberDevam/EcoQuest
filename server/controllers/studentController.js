const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const Badge = require('../models/Badge');

// Get Student Dashboard Info
const getStudentDashboard = async (req, res) => {
  try {
    const student = await User.findById(req.user.id)
      .populate('badges')
      .populate('completedChallenges', 'title points')
      .select('-password');
      
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    // Calculate Rank (Basic logic based on all students points)
    const allStudents = await User.find({ role: 'student' }).sort({ ecoPoints: -1 }).select('_id');
    const rank = allStudents.findIndex(s => s._id.toString() === req.user.id) + 1;

    res.json({
      student,
      rank,
      totalPoints: student.ecoPoints,
      completedChallengesCount: student.completedChallenges.length,
      level: student.level
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get All Lessons
const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().select('title description pointsReward media createdAt');
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Submit Quiz (simplified logic)
const submitQuiz = async (req, res) => {
  try {
    const { lessonId, score } = req.body;
    
    const student = await User.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check if lesson already completed
    if (student.completedLessons.includes(lessonId)) {
        return res.status(400).json({ message: 'Lesson already completed' });
    }

    // Award Points (e.g., score could be number of correct answers * 10)
    const pointsEarned = score * 10;
    student.ecoPoints += pointsEarned;
    student.completedLessons.push(lessonId);
    
    // Update level
    updateStudentLevel(student);

    await student.save();

    res.json({ message: 'Quiz submitted successfully', pointsEarned, totalPoints: student.ecoPoints, newLevel: student.level });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Submit Challenge
const submitChallenge = async (req, res) => {
    try {
        const { challengeId, imageProof, description } = req.body;

        const newSubmission = new Submission({
            challengeId,
            studentId: req.user.id,
            imageProof,
            description
        });

        await newSubmission.save();

        res.status(201).json({ message: 'Challenge submission sent for review', submission: newSubmission });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}


// Helper for levels
const updateStudentLevel = (student) => {
    const p = student.ecoPoints;
    if (p > 1000) student.level = 'Forest Guardian';
    else if (p > 500) student.level = 'Tree';
    else if (p > 100) student.level = 'Sapling';
    else student.level = 'Seed';
}

module.exports = { getStudentDashboard, getLessons, submitQuiz, submitChallenge };
