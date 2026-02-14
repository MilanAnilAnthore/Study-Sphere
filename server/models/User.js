const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  sex: String,
  major: { type: String, required: true },
  school: { type: String, required: true },
  country: String,
  city: String,
  province: String,
  studyType: String, // optional, for extra matching
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
