const express = require('express');
const router = express.Router();
const Major = require('../models/major');
const asyncHandler = require('../utils/asyncHandler');



// Get all majors with specializations included
router.get('/', asyncHandler(async (req, res) => {
    const majors = await Major.find().sort({ name: 1 });
    res.json(majors);
}));

module.exports = router;