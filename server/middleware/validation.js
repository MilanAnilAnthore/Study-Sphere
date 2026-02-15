const Joi = require('joi');
const ExpressError = require('../utils/ExpressError');

// Middleware factory to validate request data
const validateRequest = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false, // Return all errors, not just the first
            stripUnknown: true  // Remove fields not in schema
        });

        if (error) {
            const details = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            throw new ExpressError('Validation failed', {
                status: 400,
                code: 'VALIDATION_ERROR',
                details
            });
        }

        // Replace req data with validated and sanitized data
        req[property] = value;
        next();
    };
};

module.exports = { validateRequest };