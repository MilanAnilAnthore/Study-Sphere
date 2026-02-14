const mongoose = require('mongoose');
const Major = require('../models/major');

const majors = [
    // Business, Management, and Commerce
    {
        name: "Accounting",
        specializations: ["Financial Accounting", "Management Accounting", "Tax Accounting", "Forensic Accounting", "Audit"]
    },
    {
        name: "Business Administration",
        specializations: ["General Management", "Entrepreneurship", "International Business", "Operations Management", "Strategic Management"]
    },
    {
        name: "Commerce",
        specializations: ["General Commerce", "Digital Commerce", "International Commerce", "Business Economics"]
    },
    {
        name: "Finance",
        specializations: ["Corporate Finance", "Investment Banking", "Financial Planning", "Risk Management", "Quantitative Finance"]
    },
    {
        name: "Management",
        specializations: ["Human Resources", "Project Management", "Operations Management", "Strategic Management", "Supply Chain Management"]
    },
    {
        name: "Marketing",
        specializations: ["Digital Marketing", "Brand Management", "Market Research", "Consumer Behavior", "Social Media Marketing"]
    },

    // Engineering and Applied Sciences
    {
        name: "Chemical Engineering",
        specializations: ["Process Engineering", "Biochemical Engineering", "Environmental Engineering", "Materials Science", "Petroleum Engineering"]
    },
    {
        name: "Civil Engineering",
        specializations: ["Structural Engineering", "Transportation Engineering", "Geotechnical Engineering", "Water Resources", "Construction Management"]
    },
    {
        name: "Computer Engineering",
        specializations: ["Embedded Systems", "Computer Architecture", "Networks and Security", "Hardware Design", "IoT Systems"]
    },
    {
        name: "Electrical Engineering",
        specializations: ["Power Systems", "Control Systems", "Electronics", "Signal Processing", "Telecommunications"]
    },
    {
        name: "Mechanical Engineering",
        specializations: ["Thermodynamics", "Robotics", "Manufacturing", "Automotive Engineering", "Mechatronics"]
    },
    {
        name: "Software Engineering",
        specializations: ["Web Development", "Mobile Applications", "Cloud Computing", "DevOps", "Software Architecture"]
    },

    // Health and Life Sciences
    {
        name: "Biochemistry",
        specializations: ["Molecular Biology", "Clinical Biochemistry", "Biotechnology", "Pharmaceutical Sciences", "Research"]
    },
    {
        name: "Biology",
        specializations: ["Molecular Biology", "Ecology", "Cell Biology", "Genetics", "Microbiology"]
    },
    {
        name: "Health Sciences",
        specializations: ["Public Health", "Health Policy", "Global Health", "Community Health", "Health Management"]
    },
    {
        name: "Kinesiology",
        specializations: ["Exercise Science", "Sport Management", "Biomechanics", "Rehabilitation", "Athletic Therapy"]
    },
    {
        name: "Nursing",
        specializations: ["Critical Care", "Pediatrics", "Mental Health", "Community Health", "Geriatrics"]
    },

    // Data, Math, and Physical Sciences
    {
        name: "Chemistry",
        specializations: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Analytical Chemistry", "Biochemistry"]
    },
    {
        name: "Computer Science",
        specializations: ["Artificial Intelligence", "Software Development", "Cybersecurity", "Data Science", "Computer Graphics"]
    },
    {
        name: "Data Science",
        specializations: ["Machine Learning", "Big Data Analytics", "Business Intelligence", "Statistical Analysis", "Data Engineering"]
    },
    {
        name: "Mathematics",
        specializations: ["Pure Mathematics", "Applied Mathematics", "Statistics", "Mathematical Finance", "Computational Mathematics"]
    },
    {
        name: "Physics",
        specializations: ["Theoretical Physics", "Experimental Physics", "Astrophysics", "Quantum Physics", "Applied Physics"]
    },
    {
        name: "Statistics",
        specializations: ["Biostatistics", "Applied Statistics", "Mathematical Statistics", "Data Analytics", "Actuarial Science"]
    },

    // Social Sciences and Education
    {
        name: "Economics",
        specializations: ["Microeconomics", "Macroeconomics", "Econometrics", "Development Economics", "Financial Economics"]
    },
    {
        name: "Education",
        specializations: ["Elementary Education", "Secondary Education", "Special Education", "Educational Psychology", "Curriculum Development"]
    },
    {
        name: "Political Science",
        specializations: ["International Relations", "Public Policy", "Comparative Politics", "Political Theory", "Canadian Politics"]
    },
    {
        name: "Psychology",
        specializations: ["Clinical Psychology", "Cognitive Psychology", "Developmental Psychology", "Social Psychology", "Neuropsychology"]
    },
    {
        name: "Sociology",
        specializations: ["Social Theory", "Criminology", "Urban Sociology", "Social Research", "Family Studies"]
    },

    // Humanities, Arts, and Law
    {
        name: "Architecture",
        specializations: ["Urban Design", "Sustainable Architecture", "Interior Architecture", "Landscape Architecture", "Building Technology"]
    },
    {
        name: "English Literature",
        specializations: ["British Literature", "American Literature", "Creative Writing", "Literary Theory", "Contemporary Literature"]
    },
    {
        name: "Fine Arts",
        specializations: ["Painting", "Sculpture", "Digital Arts", "Photography", "Art History"]
    },
    {
        name: "History",
        specializations: ["Ancient History", "Modern History", "Canadian History", "World History", "Social History"]
    },
    {
        name: "Law",
        specializations: ["Corporate Law", "Criminal Law", "International Law", "Environmental Law", "Human Rights Law"]
    },
    {
        name: "Philosophy",
        specializations: ["Ethics", "Logic", "Political Philosophy", "Metaphysics", "Philosophy of Mind"]
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