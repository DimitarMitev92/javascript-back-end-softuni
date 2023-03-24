const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pet is required!'],
        minLength: 2
    },
    age: {
        type: Number,
        required: [true, 'Age is required!'],
        min: 1,
        max: 100
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minLength: 5,
        maxLength: 50
    },
    location: {
        type: String,
        require: [true, 'Location is required!'],
        minLength: 5,
        maxLength: 50
    },
    imageUrl: {
        type: String,
        required: [true, 'Image is required!'],
        validate: /^(http|https):\/\//
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    commentList: [{
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        username: {
            type: String
        },
        comment: {
            type: String
        }
    }]
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;