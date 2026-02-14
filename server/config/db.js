// config/db.js
const mongoose = require('mongoose');

const connectDB = (mongoURI) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(mongoURI)
            .then(() => {
                console.log('Database connected');
                resolve();
            })
            .catch((err) => {
                console.error('Connection error:', err);
                reject(err);
            });
    });
};

module.exports = connectDB;
