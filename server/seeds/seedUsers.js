const mongoose = require('mongoose');
const User = require('../models/user');
const College = require('../models/college');
const Major = require('../models/major');

const seedUsers = async () => {
    try {
        // Fetch all colleges and majors from database
        const colleges = await College.find();
        const majors = await Major.find();

        if (colleges.length === 0 || majors.length === 0) {
            console.log('⚠️  Please seed colleges and majors first!');
            return;
        }

        // Helper function to get random item from array
        const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        // Helper function to find college by name
        const findCollege = (name) => colleges.find(c => c.name === name);

        // Helper function to find major by name
        const findMajor = (name) => majors.find(m => m.name === name);

        // Create users with proper references
        const users = [
            {
                name: 'Milan',
                age: 21,
                yearOfStudy: 3,
                sex: 'M',
                college: findCollege('York University')._id,
                major: findMajor('Computer Science')._id,
                specialization: 'Software Development'
            },
            {
                name: 'Alex',
                age: 22,
                yearOfStudy: 4,
                sex: 'M',
                college: findCollege('York University')._id,
                major: findMajor('Computer Science')._id,
                specialization: 'Artificial Intelligence'
            },
            {
                name: 'Sara',
                age: 20,
                yearOfStudy: 2,
                sex: 'F',
                college: findCollege('University of Toronto')._id,
                major: findMajor('Mathematics')._id,
                specialization: 'Applied Mathematics'
            },
            {
                name: 'John',
                age: 23,
                yearOfStudy: 4,
                sex: 'M',
                college: findCollege('York University')._id,
                major: findMajor('Mechanical Engineering')._id,
                specialization: 'Robotics'
            },
            {
                name: 'Emma',
                age: 21,
                yearOfStudy: 3,
                sex: 'F',
                college: findCollege('York University')._id,
                major: findMajor('Computer Science')._id,
                specialization: 'Cybersecurity'
            },
            {
                name: 'Olivia',
                age: 22,
                yearOfStudy: 3,
                sex: 'F',
                college: findCollege('University of Toronto')._id,
                major: findMajor('Mathematics')._id,
                specialization: 'Statistics'
            },
            {
                name: 'Liam',
                age: 20,
                yearOfStudy: 2,
                sex: 'M',
                college: findCollege('University of Waterloo')._id,
                major: findMajor('Software Engineering')._id,
                specialization: 'Web Development'
            },
            {
                name: 'Sophia',
                age: 21,
                yearOfStudy: 3,
                sex: 'F',
                college: findCollege('McGill University')._id,
                major: findMajor('Business Administration')._id,
                specialization: 'Entrepreneurship'
            },
            {
                name: 'Noah',
                age: 22,
                yearOfStudy: 4,
                sex: 'M',
                college: findCollege('University of British Columbia')._id,
                major: findMajor('Data Science')._id,
                specialization: 'Machine Learning'
            },
            {
                name: 'Ava',
                age: 19,
                yearOfStudy: 1,
                sex: 'F',
                college: findCollege('University of Toronto')._id,
                major: findMajor('Psychology')._id,
                specialization: 'Clinical Psychology'
            }
        ];

        // Remove existing users
        await User.deleteMany({});
        console.log('🗑️  Existing users removed');

        // Insert new users
        const createdUsers = await User.insertMany(users);
        console.log(`✅ Seeded ${createdUsers.length} users successfully!`);
        console.log(`📊 Total users: ${createdUsers.length}`);

    } catch (error) {
        console.error('❌ Error seeding users:', error);
    }
};

module.exports = seedUsers;