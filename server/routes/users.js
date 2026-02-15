const express = require('express');
const router = express.Router();
const User = require('../models/user');
const College = require('../models/college');
const Faculty = require('../models/faculty');
const ExpressError = require('../utils/ExpressError');
const asyncHandler = require('../utils/asyncHandler');
const { validateRequest } = require('../middleware/validation');
const {
    registerUserSchema,
    updateUserSchema,
    idParamSchema
} = require('../validation/userSchemas');


// Initialize Google Gemini AI SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ========== USER ROUTES ==========


// Get all users (with populated references)
router.get('/', asyncHandler(async (req, res) => {
    const users = await User.find()
        .populate('college', 'name city country')
        .populate('faculty', 'name majors');
    res.json(users);
}));

// Get single user by ID (with populated references)
router.get('/:id',
    validateRequest(idParamSchema, 'params'),  // Validate ID format
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id)
            .populate('college')
            .populate('faculty');

        if (!user) {
            throw new ExpressError('User not found', {
                status: 404,
                code: 'USER_NOT_FOUND'
            });
        }
        res.json(user);
    })
);

// Match users togther
router.get('/:id/match', asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
        .populate('college')
        .populate('faculty');

    if (!user) {
        throw new ExpressError('User not found', { status: 404, code: 'USER_NOT_FOUND' });
    }

    //Find candidates
    const candidates = await User.find({ _id: { $ne: req.params.id } })
        .populate('college')
        .populate('faculty')
        .limit(15);

    if (candidates.length === 0) {
        return res.json({ message: "No candidates available for matching.", matches: [] });
    }

    // Initalize Gemini API
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", // Use the current 2026 stable version
        generationConfig: { responseMimeType: "application/json" }
    });

    // Prompt for Gemini
    const prompt = `
        You are a university study buddy matching assistant.
        Target Student:
        - Name: ${user.name}
        - Age: ${user.age}
        - College: ${user.college}
        - Major: ${user.major}
        - Specialization: ${user.faculty}
        - Year: ${user.year}

        Candidates List: ${JSON.stringify(candidates)}

        Task: Find the top 3 best matches based on academic compatibility.
        Return ONLY a JSON array of objects with keys: "name", "matchScore" (0-100), and "reason" (one helpful sentence).
    `;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        res.json(JSON.parse(responseText));
    } catch (aiError) {
        throw new ExpressError('AI Matching failed. Please try again later.', {
            status: 503,
            code: 'AI_SERVICE_ERROR'
        });
    }
}));



// Register new user
router.post('/register',
    validateRequest(registerUserSchema),  // Validate request body
    asyncHandler(async (req, res) => {
        const { name, email, age, year, sex, school, academicArea, major } = req.body;

        // Check for duplicate email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ExpressError('Email already registered', {
                status: 409,
                code: 'DUPLICATE_EMAIL'
            });
        }

        // Find college and major by name
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

        // Create new user
        const newUser = await User.create({
            name,
            email,
            age,
            year,
            sex,
            college: college._id,
            faculty: faculty._id,
            major
        });

        // Return with populated references
        const populatedUser = await User.findById(newUser._id)
            .populate('college')
            .populate('faculty');

        res.status(201).json(populatedUser);
    })
);

// Update user
router.put('/:id',
    validateRequest(idParamSchema, 'params'),  // Validate ID
    validateRequest(updateUserSchema),          // Validate body
    asyncHandler(async (req, res) => {
        const { name, email, age, year, sex, school, academicArea, major } = req.body;

        // Check if user exists
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new ExpressError('User not found', {
                status: 404,
                code: 'USER_NOT_FOUND'
            });
        }

        // Check for duplicate email (if email is being changed)
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new ExpressError('Email already in use', {
                    status: 409,
                    code: 'DUPLICATE_EMAIL'
                });
            }
        }

        // Build update object
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (age !== undefined) updateData.age = age;
        if (year !== undefined) updateData.year = year;
        if (sex) updateData.sex = sex;
        if (major) updateData.major = major;

        // Find college and faculty by name if provided
        if (school) {
            const college = await College.findOne({ name: school });
            if (!college) {
                throw new ExpressError(`College '${school}' not found`, {
                    status: 404,
                    code: 'COLLEGE_NOT_FOUND'
                });
            }
            updateData.college = college._id;
        }

        if (academicArea) {
            const faculty = await Faculty.findOne({ name: academicArea });
            if (!faculty) {
                throw new ExpressError(`Faculty '${academicArea}' not found`, {
                    status: 404,
                    code: 'FACULTY_NOT_FOUND'
                });
            }
            updateData.faculty = faculty._id;
        }

        // Update user with new data
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('college')
            .populate('faculty');

        res.json(updatedUser);
    })
);

// DELETE user
router.delete('/:id',
    validateRequest(idParamSchema, 'params'),
    asyncHandler(async (req, res) => {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            throw new ExpressError('User not found', {
                status: 404,
                code: 'USER_NOT_FOUND'
            });
        }

        res.json({
            message: 'User deleted successfully',
            deletedUser: user
        });
    })
);

module.exports = router;