const jwt = require('jsonwebtoken');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return next(new ExpressError('Not authorized to access this route', {
            status: 401,
            code: 'NO_TOKEN'
        }));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token (exclude password)
        req.user = await User.findById(decoded.id)
            .populate('college', 'name city country')
            .populate('faculty', 'name majors');

        if (!req.user) {
            return next(new ExpressError('User not found', {
                status: 401,
                code: 'USER_NOT_FOUND'
            }));
        }

        next();
    } catch (error) {
        return next(new ExpressError('Not authorized to access this route', {
            status: 401,
            code: 'INVALID_TOKEN'
        }));
    }
};

module.exports = { protect };