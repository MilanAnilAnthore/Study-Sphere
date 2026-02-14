const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  yearOfStudy: {
    type: Number,
    min: 1,
    max: 6  // covers undergrad + masters
  },
  sex: {
    type: String
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Major',
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);