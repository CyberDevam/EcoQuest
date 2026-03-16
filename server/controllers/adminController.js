const User = require('../models/User');
const Submission = require('../models/Submission');
const Lesson = require('../models/Lesson');
const Challenge = require('../models/Challenge');

// Get All Users (Admin only)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Delete User
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
         res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Get Platform Analytics
const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        
        const totalLessons = await Lesson.countDocuments();
        const totalChallenges = await Challenge.countDocuments();
        const totalSubmissions = await Submission.countDocuments();
        const approvedSubmissions = await Submission.countDocuments({ status: 'approved' });

        res.json({
            users: {
                total: totalUsers,
                students: totalStudents,
                teachers: totalTeachers
            },
            activity: {
                lessons: totalLessons,
                challenges: totalChallenges,
                submissions: {
                    total: totalSubmissions,
                    approved: approvedSubmissions
                }
            }
        });
    } catch (error) {
         res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = { getUsers, deleteUser, getAnalytics };
