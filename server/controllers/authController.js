const User = require('../models/User');
const School = require('../models/School');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../config/email');

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password, role, schoolName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      school: schoolName,
      otp,
      otpExpires
    });

    const savedUser = await newUser.save();

    // If school provided, link school
    if (schoolName && role === 'student') {
      let school = await School.findOne({ schoolName });
      if (!school) {
        school = new School({ schoolName, students: [savedUser._id] });
      } else {
        school.students.push(savedUser._id);
      }
      await school.save();
    }

    // Send OTP Email
    try {
      await sendOTP(email, otp);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      console.log('-----------------------------------------');
      console.log(`DEV OTP FOR ${email}: ${otp}`);
      console.log('-----------------------------------------');
      // We still save the user, they can use the code from the console
    }

    res.status(201).json({ 
      message: 'Registration successful. Please verify your email with the OTP sent.', 
      user: { id: savedUser._id, email: savedUser.email, isEmailVerified: false }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during OTP verification', error: error.message });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    try {
      await sendOTP(email, otp);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      console.log('-----------------------------------------');
      console.log(`DEV RESEND OTP FOR ${email}: ${otp}`);
      console.log('-----------------------------------------');
    }

    res.status(200).json({ message: 'New OTP generated (Check server console if email fails)' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during OTP resend', error: error.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in', isVerified: false });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check account status
    if (user.accountStatus === 'blacklisted') {
      return res.status(403).json({ message: 'Account is blacklisted. Please create a new account.' });
    }

    // Check inactivity (60 days)
    const sixtyDaysInMs = 60 * 24 * 60 * 60 * 1000;
    if (user.lastLogin && (Date.now() - new Date(user.lastLogin).getTime() > sixtyDaysInMs)) {
      user.accountStatus = 'blacklisted';
      await user.save();
      return res.status(403).json({ message: 'Account blacklisted due to 60 days of inactivity. Please create a new account.' });
    }

    // Update lastLogin
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'ecoquest_secret_key',
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
        ecoPoints: user.ecoPoints,
        level: user.level
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// Logout User
const logout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

// Get Current User
const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = { register, login, logout, getMe, verifyOTP, resendOTP };
