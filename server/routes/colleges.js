const express = require('express');
const router = express.Router();
const College = require('../models/college');
const asyncHandler = require('../utils/asyncHandler');


// ========== COLLEGE ROUTES ==========

// Get all colleges with full data
router.get('/', asyncHandler(async (req, res) => {
    const colleges = await College.find().sort({ name: 1 });
    res.json(colleges);
}));


module.exports = router;