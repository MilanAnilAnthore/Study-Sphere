const mongoose = require('mongoose');
const User = require('../models/user');
const College = require('../models/college');
const Faculty = require('../models/faculty');

const seedUsers = async () => {
    try {
        // Fetch all colleges and majors from database
        const colleges = await College.find();
        const faculties = await Faculty.find();

        if (colleges.length === 0 || faculties.length === 0) {
            console.log('⚠️  Please seed colleges and faculties first!');
            return;
        }

        // Helper function to get random item from array
        const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        // Helper function to find college by name
        const findCollege = (name) => {
            const college = colleges.find(c => c.name === name);
            if (!college) {
                throw new Error(`College '${name}' not found in database`);
            }
            return college;
        };

        // Helper function to find faculty by name
        const findFaculty = (name) => {
            const faculty = faculties.find(f => f.name === name);
            if (!faculty) {
                throw new Error(`Faculty '${name}' not found in database`);
            }
            return faculty;
        };

        // Create users with proper references
        const users = [
            {
                name: 'Milan',
                age: 21,
                year: 3,
                sex: 'Male',
                college: findCollege('York University')._id,
                faculty: findFaculty('Data, Math, and Physical Sciences')._id,
                major: 'Computer Science'
            },
            {
                name: 'Alex',
                age: 22,
                year: 4,
                sex: 'Male',
                college: findCollege('York University')._id,
                faculty: findFaculty('Data, Math, and Physical Sciences')._id,
                major: 'Computer Science'
            },
            {
                name: 'Sara',
                age: 20,
                year: 2,
                sex: 'Female',
                college: findCollege('University of Toronto')._id,
                faculty: findFaculty('Data, Math, and Physical Sciences')._id,
                major: 'Mathematics'
            },
            {
                name: 'John',
                age: 23,
                year: 4,
                sex: 'Male',
                college: findCollege('York University')._id,
                faculty: findFaculty('Engineering and Applied Sciences')._id,
                major: 'Mechanical Engineering'
            },
            {
                name: 'Emma',
                age: 21,
                year: 3,
                sex: 'Female',
                college: findCollege('York University')._id,
                faculty: findFaculty('Data, Math, and Physical Sciences')._id,
                major: 'Computer Science'
            },
            {
                name: 'Olivia',
                age: 22,
                year: 3,
                sex: 'Female',
                college: findCollege('University of Toronto')._id,
                faculty: findFaculty('Data, Math, and Physical Sciences')._id,
                major: 'Statistics'
            },
            {
                name: 'Liam',
                age: 20,
                year: 2,
                sex: 'Male',
                college: findCollege('University of Waterloo')._id,
                faculty: findFaculty('Engineering and Applied Sciences')._id,
                major: 'Software Engineering'
            },
            {
                name: 'Sophia',
                age: 21,
                year: 3,
                sex: 'Female',
                college: findCollege('McGill University')._id,
                faculty: findFaculty('Business, Management, and Commerce')._id,
                major: 'Business Administration'
            },
            {
                name: 'Noah',
                age: 22,
                year: 4,
                sex: 'Male',
                college: findCollege('University of British Columbia')._id,
                faculty: findFaculty('Data, Math, and Physical Sciences')._id,
                major: 'Data Science'
            },
            {
                name: 'Ava',
                age: 19,
                year: 1,
                sex: 'Female',
                college: findCollege('University of Toronto')._id,
                faculty: findFaculty('Social Sciences and Education')._id,
                major: 'Psychology'
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