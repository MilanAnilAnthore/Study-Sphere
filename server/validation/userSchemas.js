const Joi = require('joi');

// Custom validator for MongoDB ObjectId
const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Invalid ID format'
});

// Schema for user registration
const registerUserSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name cannot exceed 100 characters',
            'any.required': 'Name is required'
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    age: Joi.number()
        .integer()
        .min(16)
        .max(100)
        .optional()
        .messages({
            'number.min': 'Age must be at least 16',
            'number.max': 'Age cannot exceed 100'
        }),

    year: Joi.number()
        .integer()
        .min(1)
        .max(6)
        .optional()
        .messages({
            'number.min': 'Year must be at least 1',
            'number.max': 'Year cannot exceed 6'
        }),

    sex: Joi.string()
        .valid('Male', 'Female', 'Prefer not to say')
        .optional()
        .messages({
            'any.only': 'Sex must be Male, Female, or Prefer not to say'
        }),

    school: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required': 'School is required'
        }),

    academicArea: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required': 'Academic area is required'
        }),

    major: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required': 'Major is required'
        })
});

// Schema for user update (all fields optional)
const updateUserSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    email: Joi.string().trim().lowercase().email(),
    age: Joi.number().integer().min(16).max(100),
    year: Joi.number().integer().min(1).max(6),
    sex: Joi.string().valid('Male', 'Female', 'Prefer not to say'),
    school: Joi.string().trim(),
    academicArea: Joi.string().trim(),
    major: Joi.string().trim()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

// Schema for validating ID parameter
const idParamSchema = Joi.object({
    id: objectId.required()
});

module.exports = {
    registerUserSchema,
    updateUserSchema,
    idParamSchema
};