// seeds/seedUsers.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const users = require('./users'); // Import fake users
const connectDB = require('../config/db');
const mongoDB_Dev = process.env.MONGODB_URI_DEV;


const seedUsers = async () => {
    try {
        await connectDB(mongoDB_Dev);

        // Remove existing users
        await User.deleteMany();
        console.log('Existing users removed');

        // Insert fake users
        const createdUsers = await User.insertMany(users);
        console.log(`Seeded ${createdUsers.length} users`);

        // Close the connection properly
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedUsers();
