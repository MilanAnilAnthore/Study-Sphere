const express = require('express');
const router = express.Router();
const Faculty = require('../models/faculty');
const asyncHandler = require('../utils/asyncHandler');



// Fetch all faculties from database  
router.get('/', asyncHandler(async (req, res) => {
    const faculties = await Faculty.find().sort({ name: 1 });
    res.json(faculties);
}));

// Get majors for a specific faculty by name
router.get('/:name/majors', asyncHandler(async (req, res) => {
    const faculty = await Faculty.findOne({ name: req.params.name });

    if (!faculty) {
        const ExpressError = require('../utils/ExpressError');
        throw new ExpressError('Faculty not found', {
            status: 404,
            code: 'FACULTY_NOT_FOUND'
        });
    }

    res.json(faculty.majors);
}));

module.exports = router;