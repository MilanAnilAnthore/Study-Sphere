const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/user');

const PORT = process.env.PORT || 3000;
const mongoDB_Prod = process.env.MONGODB_URI;
const mongoDB_Dev = process.env.MONGODB_URI_DEV;
const methodOverride = require('method-override');

connectDB(mongoDB_Dev);

app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));// Parse URL-encoded bodies
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.send('Welcome to study-sphere');
});


app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post('/api/users/register', async (req, res) => {
    try {
        const { name, age, sex, major, school, country, city, province, studyType } = req.body;

        // Validate required fields
        if (!name || !major || !school) {
            return res.status(400).json({ message: 'Name, major, and school are required' });
        }

        // Create new user
        const newUser = new User({
            name,
            age,
            sex,
            major,
            school,
            country,
            city,
            province,
            studyType
        });

        // Save to database
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, age, sex, major, school, country, city, province, studyType } = req.body;

        // Check if user exists
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user with new data
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                age,
                sex,
                major,
                school,
                country,
                city,
                province,
                studyType
            },
            { new: true, runValidators: true }
        );

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});