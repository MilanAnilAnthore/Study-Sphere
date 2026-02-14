const express = require('express');
const router = express.Router();
const User = require('../models/user');
const College = require('../models/college');
const Major = require('../models/major');
const ExpressError = require('../utils/ExpressError');
const asyncHandler = require('../utils/asyncHandler');




// ========== USER ROUTES ==========

// Get all users (with populated references)
router.get('/', asyncHandler(async (req, res) => {
    const users = await User.find()
        .populate('college', 'name city country')
        .populate('major', 'name');
    res.json(users);
}));


// Get single user by ID (with populated references)
router.get('/:id', asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
        .populate('college')
        .populate('major');

    if (!user) {
        throw new ExpressError('User not found', { status: 404, code: 'USER_NOT_FOUND' });
    }

    res.json(user);
}));


// Register new user
router.post('/register', asyncHandler(async (req, res) => {
    const { name, age, yearOfStudy, sex, collegeName, majorName, specialization } = req.body;

    // Validate required fields
    if (!name || !collegeName || !majorName || !specialization) {
        throw new ExpressError('Name, college, major, and specialization are required', {
            status: 400,
            code: 'VALIDATION_ERROR'
        });
    }

    // Find college and major by name
    const college = await College.findOne({ name: collegeName });
    const major = await Major.findOne({ name: majorName });

    if (!college) {
        throw new ExpressError(`College '${collegeName}' not found`, {
            status: 404,
            code: 'COLLEGE_NOT_FOUND'
        });
    }
    if (!major) {
        throw new ExpressError(`Major '${majorName}' not found`, {
            status: 404,
            code: 'MAJOR_NOT_FOUND'
        });
    }

    // Create new user
    const newUser = await User.create({
        name,
        age,
        yearOfStudy,
        sex,
        college: college._id,
        major: major._id,
        specialization
    });

    // Return with populated references
    const populatedUser = await User.findById(newUser._id)
        .populate('college')
        .populate('major');

    res.status(201).json(populatedUser);
}));


// Update user
router.put('/:id', asyncHandler(async (req, res) => {
    const { name, age, yearOfStudy, sex, collegeName, majorName, specialization } = req.body;

    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new ExpressError('User not found', { status: 404, code: 'USER_NOT_FOUND' });
    }

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (age) updateData.age = age;
    if (yearOfStudy) updateData.yearOfStudy = yearOfStudy;
    if (sex) updateData.sex = sex;
    if (specialization) updateData.specialization = specialization;

    // Find college and major by name if provided
    if (collegeName) {
        const college = await College.findOne({ name: collegeName });
        if (!college) {
            throw new ExpressError(`College '${collegeName}' not found`, {
                status: 404,
                code: 'COLLEGE_NOT_FOUND'
            });
        }
        updateData.college = college._id;
    }

    if (majorName) {
        const major = await Major.findOne({ name: majorName });
        if (!major) {
            throw new ExpressError(`Major '${majorName}' not found`, {
                status: 404,
                code: 'MAJOR_NOT_FOUND'
            });
        }
        updateData.major = major._id;
    }

    // Update user with new data
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
    )
        .populate('college')
        .populate('major');

    res.json(updatedUser);
}));

module.exports = router;