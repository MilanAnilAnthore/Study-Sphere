const Joi = require('joi');

const envSchema = Joi.object({
    PORT: Joi.number().default(5000),
    MONGODB_URI: Joi.string().uri().required(),
    MONGODB_URI_DEV: Joi.string().uri().required(),
    GEMINI_API_KEY: Joi.string().required().messages({
        'any.required': 'GEMINI_API_KEY is required for AI matching features',
        'string.empty': 'GEMINI_API_KEY cannot be empty'
    }),
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development')
}).unknown(); // Allow other env variables

const validateEnv = () => {
    const { error, value } = envSchema.validate(process.env);

    if (error) {
        throw new Error(`Environment validation error: ${error.message}`);
    }

    return value;
};

module.exports = validateEnv;