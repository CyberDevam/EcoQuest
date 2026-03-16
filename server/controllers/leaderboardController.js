const User = require('../models/User');
const School = require('../models/School');

// Get Students Leaderboard
const getStudentLeaderboard = async (req, res) => {
    try {
        const topStudents = await User.find({ role: 'student' })
                                  .sort({ ecoPoints: -1 })
                                  .limit(10)
                                  .select('name school ecoPoints level badges');
                                  
        res.json(topStudents);
    } catch (error) {
         res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Get Schools Leaderboard
const getSchoolLeaderboard = async (req, res) => {
    try {
         const topSchools = await School.find({})
                                  .sort({ totalPoints: -1 })
                                  .limit(10);
                                  
        res.json(topSchools);
    } catch (error) {
         res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = { getStudentLeaderboard, getSchoolLeaderboard };
