const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  age: {
    type: Number
  },
  year: {
    type: Number,
    min: 1,
    max: 6
  },
  sex: {
    type: String,
    enum: ['Male', 'Female', 'Prefer not to say'],
    required: false
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  major: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


userSchema.index({ email: 1 });
userSchema.index({ college: 1 });
userSchema.index({ faculty: 1 });

// Hash password and update timestamp before saving
userSchema.pre('save', async function () {
  // Update timestamp
  this.updatedAt = Date.now();

  // Only hash if password is modified
  if (!this.isModified('password')) {
    return;
  }

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);