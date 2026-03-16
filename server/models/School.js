const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true,
    unique: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalPoints: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);
