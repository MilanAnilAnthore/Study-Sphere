const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    matches: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        matchScore: Number,
        reason: String,
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: () => Date.now() + 7 * 24 * 60 * 60 * 1000  // 7 days
    }
});

// Index for efficient queries
matchSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Match', matchSchema);