const express = require('express');
const router = express.Router();
const User = require('../models/user');
const College = require('../models/college');
const Faculty = require('../models/faculty');
const ExpressError = require('../utils/ExpressError');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/auth');
const Joi = require('joi');

// Validation schemas
const registerSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(6).required(),
    age: Joi.number().integer().min(16).max(100).optional(),
    year: Joi.number().integer().min(1).max(6).optional(),
    sex: Joi.string().valid('Male', 'Female', 'Prefer not to say').optional(),
    school: Joi.string().trim().required(),
    academicArea: Joi.string().trim().required(),
    major: Joi.string().trim().required()
});

const loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().required()
});

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', asyncHandler(async (req, res) => {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        throw new ExpressError('Validation failed', {
            status: 400,
            code: 'VALIDATION_ERROR',
            details: error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
        });
    }

    const { name, email, password, age, year, sex, school, academicArea, major } = value;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ExpressError('Email already registered', {
            status: 409,
            code: 'EMAIL_EXISTS'
        });
    }

    // Find college and faculty
    const college = await College.findOne({ name: school });
    const faculty = await Faculty.findOne({ name: academicArea });

    if (!college) {
        throw new ExpressError(`College '${school}' not found`, {
            status: 404,
            code: 'COLLEGE_NOT_FOUND'
        });
    }
    if (!faculty) {
        throw new ExpressError(`Faculty '${academicArea}' not found`, {
            status: 404,
            code: 'FACULTY_NOT_FOUND'
        });
    }

    // Create user (password will be hashed automatically)
    const user = await User.create({
        name,
        email,
        password,
        age,
        year,
        sex,
        college: college._id,
        faculty: faculty._id,
        major
    });

    // Populate references for response
    await user.populate('college', 'name city country');
    await user.populate('faculty', 'name majors');

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            year: user.year,
            sex: user.sex,
            college: user.college,
            faculty: user.faculty,
            major: user.major
        }
    });
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        throw new ExpressError('Validation failed', {
            status: 400,
            code: 'VALIDATION_ERROR',
            details: error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
        });
    }

    const { email, password } = value;

    // Find user with password field (normally excluded)
    const user = await User.findOne({ email })
        .select('+password')
        .populate('college', 'name city country')
        .populate('faculty', 'name majors');

    if (!user) {
        throw new ExpressError('Invalid email or password', {
            status: 401,
            code: 'INVALID_CREDENTIALS'
        });
    }

    // Check password using model method
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new ExpressError('Invalid email or password', {
            status: 401,
            code: 'INVALID_CREDENTIALS'
        });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
        success: true,
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            year: user.year,
            sex: user.sex,
            college: user.college,
            faculty: user.faculty,
            major: user.major
        }
    });
}));

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
}));

module.exports = router;