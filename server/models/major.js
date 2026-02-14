const mongoose = require('mongoose');

const majorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    specializations: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Major', majorSchema);