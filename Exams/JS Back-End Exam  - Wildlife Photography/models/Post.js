const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required!'],
        minLength: 6
    },
    keyword: {
        type: String,
        required: [true, 'Keyword is required!'],
        minLength: 6,
    },
    location: {
        type: String,
        required: [true, 'Location is required!'],
        maxLength: 15
    },
    date: {
        type: String,
        required: [true, 'Date is required!'],
        validate: /^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/
    },
    imageUrl: {
        type: String,
        required: [true, 'Image is required!'],
        validate: /^https?:\/\//
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minLength: 8
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    votesPost: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    ratingPost: {
        type: Number,
        default: 0
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;