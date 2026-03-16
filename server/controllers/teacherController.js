const Lesson = require('../models/Lesson');
const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const User = require('../models/User');

// Create Lesson
const createLesson = async (req, res) => {
  try {
    const { title, description, content, media, quiz, pointsReward } = req.body;
    
    const newLesson = new Lesson({
      title,
      description,
      content,
      media,
      quiz,
      pointsReward,
      createdBy: req.user.id
    });

    await newLesson.save();
    res.status(201).json({ message: 'Lesson created successfully', lesson: newLesson });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create Challenge
const createChallenge = async (req, res) => {
    try {
        const { title, description, difficulty, points, deadline } = req.body;
        
        const newChallenge = new Challenge({
            title,
            description,
            difficulty,
            points,
            deadline,
            createdBy: req.user.id
        });

        await newChallenge.save();
        res.status(201).json({ message: 'Challenge created successfully', challenge: newChallenge });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Get Submissions
const getSubmissions = async (req, res) => {
    try {
        // Find submissions for challenges created by this teacher
        const submissions = await Submission.find({})
            .populate('studentId', 'name email level items')
            .populate('challengeId', 'title points')
            .sort({ createdAt: -1 });

        res.json(submissions);
    } catch (error) {
         res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Review Submission
const reviewSubmission = async (req, res) => {
    try {
        const { submissionId, status } = req.body;
        // status enum: ['pending', 'approved', 'rejected']

        const submission = await Submission.findById(submissionId).populate('challengeId');
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        if (status === 'approved') {
            // Reward Student
            const student = await User.findById(submission.studentId);
            if (student) {
                student.ecoPoints += submission.challengeId.points;
                student.completedChallenges.push(submission.challengeId._id);
                updateStudentLevel(student);
                await student.save();
            }
        }

        submission.status = status;
        await submission.save();

        res.json({ message: `Submission marked as ${status}` });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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

module.exports = { createLesson, createChallenge, getSubmissions, reviewSubmission };
