const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
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


connectDB(mongoDB_Dev);

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



app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "OH NO, SOMETHING WENT WRONG";

    res.status(status).json({
        message,
        code: err.code
    });
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});