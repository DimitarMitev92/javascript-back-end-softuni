const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required!'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        maxLength: 50,
    },
    imageUrl: {
        type: String,
        required: [true, 'Image url is required!']
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
    },
    usersLiked: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});

const Theater = mongoose.model('Theater', theaterSchema);

module.exports = Theater;