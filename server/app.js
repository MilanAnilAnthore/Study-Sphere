const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/user');
const College = require('./models/college');
const Major = require('./models/major');

const PORT = process.env.PORT || 5000;
const mongoDB_Prod = process.env.MONGODB_URI;
const mongoDB_Dev = process.env.MONGODB_URI_DEV;
const methodOverride = require('method-override');

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


// ========== COLLEGE ROUTES ==========

// Get all colleges with full data
app.get('/api/colleges', async (req, res) => {
    try {
        const colleges = await College.find().sort({ name: 1 });
        res.json(colleges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all majors with specializations included
app.get('/api/majors', async (req, res) => {
    try {
        const majors = await Major.find().sort({ name: 1 });
        res.json(majors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ========== USER ROUTES ==========

// Get all users (with populated references)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find()
            .populate('college', 'name city country')
            .populate('major', 'name');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get single user by ID (with populated references)
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('college')
            .populate('major');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Register new user
app.post('/api/users/register', async (req, res) => {
    try {
        const { name, age, yearOfStudy, sex, collegeName, majorName, specialization } = req.body;

        // Validate required fields
        if (!name || !collegeName || !majorName || !specialization) {
            return res.status(400).json({
                message: 'Name, college, major, and specialization are required'
            });
        }

        // Find college and major by name
        const college = await College.findOne({ name: collegeName });
        const major = await Major.findOne({ name: majorName });

        if (!college) {
            return res.status(404).json({ message: `College '${collegeName}' not found` });
        }
        if (!major) {
            return res.status(404).json({ message: `Major '${majorName}' not found` });
        }

        // Create new user
        const newUser = await User.create({
            name,
            age,
            yearOfStudy,
            sex,
            college: college._id,
            major: major._id,
            specialization
        });

        // Return with populated references
        const populatedUser = await User.findById(newUser._id)
            .populate('college')
            .populate('major');

        res.status(201).json(populatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Update user
app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, age, yearOfStudy, sex, collegeName, majorName, specialization } = req.body;

        // Check if user exists
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Build update object
        const updateData = {};
        if (name) updateData.name = name;
        if (age) updateData.age = age;
        if (yearOfStudy) updateData.yearOfStudy = yearOfStudy;
        if (sex) updateData.sex = sex;
        if (specialization) updateData.specialization = specialization;

        // Find college and major by name if provided
        if (collegeName) {
            const college = await College.findOne({ name: collegeName });
            if (!college) {
                return res.status(404).json({ message: `College '${collegeName}' not found` });
            }
            updateData.college = college._id;
        }

        if (majorName) {
            const major = await Major.findOne({ name: majorName });
            if (!major) {
                return res.status(404).json({ message: `Major '${majorName}' not found` });
            }
            updateData.major = major._id;
        }

        // Update user with new data
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('college')
            .populate('major');

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});