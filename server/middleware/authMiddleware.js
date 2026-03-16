const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      return res.status(403).json({ message: 'Access Denied: No token provided' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET || 'ecoquest_secret_key');
    const user = await User.findById(verified.id).select('-password');

    if (!user) {
      res.clearCookie('token');
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.accountStatus === 'blacklisted') {
      return res.status(403).json({ message: 'Access Denied: Account is blacklisted' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Access Denied: Email not verified' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

const isTeacherOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'teacher' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Requires Teacher or Admin role' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Requires Admin role' });
  }
};

const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Requires Student role' });
  }
};

module.exports = { verifyToken, isTeacherOrAdmin, isAdmin, isStudent };
