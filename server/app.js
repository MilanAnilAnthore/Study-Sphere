const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const validateEnv = require('./config/validateEnv');
validateEnv();
const connectDB = require('./config/db');
const ExpressError = require('./utils/ExpressError');

const PORT = process.env.PORT || 5000;
const mongoDB_Prod = process.env.MONGODB_URI;
const mongoDB_Dev = process.env.MONGODB_URI_DEV;
const methodOverride = require('method-override');

// Import route modules
const collegeRoutes = require('./routes/colleges');
const facultyRoutes = require('./routes/faculties');
const userRoutes = require('./routes/users');


connectDB(mongoDB_Dev).catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});


app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));// Parse URL-encoded bodies
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.send('Welcome to study-sphere');
});


// Mount routes
app.use('/api/colleges', collegeRoutes);
app.use('/api/faculties', facultyRoutes);
app.use('/api/users', userRoutes);


// Handle undefined routes
app.all(/(.*)/, (req, res, next) => {
    throw new ExpressError(`Cannot find ${req.originalUrl}`, {
        status: 404,
        code: 'ROUTE_NOT_FOUND'
    });
});

// Add this before your current error handler
app.use((err, req, res, next) => {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const details = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));

        return res.status(400).json({
            message: 'Validation failed',
            code: 'MONGOOSE_VALIDATION_ERROR',
            details
        });
    }

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            message: 'Invalid ID format',
            code: 'INVALID_ID'
        });
    }

    // Handle duplicate key error (MongoDB E11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
            message: `${field} already exists`,
            code: 'DUPLICATE_KEY',
            details: { field }
        });
    }

    next(err);
});


app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "OH NO, SOMETHING WENT WRONG";

    res.status(status).json({
        message,
        code: err.code,
        ...(err.details && { details: err.details })
    })
});




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});