const Joi = require('joi');

const nameParamSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Faculty name cannot be empty',
            'string.max': 'Faculty name too long'
        })
});

module.exports = { nameParamSchema };