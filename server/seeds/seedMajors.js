const mongoose = require('mongoose');
const Major = require('../models/major');

const majors = [
    {
        name: "Business, Management, and Commerce",
        specializations: ["Accounting", "Business Administration", "Commerce", "Finance", "Management", "Marketing"]
    },
    {
        name: "Engineering and Applied Sciences",
        specializations: ["Chemical Engineering", "Civil Engineering", "Computer Engineering",
            "Electrical Engineering", "Mechanical Engineering", "Software Engineering"]
    },
    {
        name: "Health and Life Sciences",
        specializations: ["Biochemistry", "Biology", "Health Sciences", "Kinesiology", "Nursing"]
    },
    {
        name: "Data, Math, and Physical Sciences",
        specializations: ["Chemistry", "Computer Science", "Data Science", "Mathematics", "Physics", "Statistics"]
    },
    {
        name: "Social Sciences and Education",
        specializations: ["Economics", "Education", "Political Science", "Psychology", "Sociology"]
    },
    {
        name: "Humanities, Arts, and Law",
        specializations: ["Architecture", "English Literature", "Fine Arts", "History", "Law", "Philosophy"]
    }
];

const seedMajors = async () => {
    try {
        await Major.deleteMany({}); // Clear existing data
        await Major.insertMany(majors);
        console.log('✅ Majors seeded successfully!');
        console.log(`📊 Total majors: ${majors.length}`);
    } catch (error) {
        console.error('❌ Error seeding majors:', error);
    }
};

module.exports = seedMajors;