const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required!'],
        minLength: 3,
        validate: /^[A-Za-z]*$/
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required!'],
        minLength: 5,
        validate: /^[A-Za-z]*$/
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        validate: /^[a-z]*\@[a-z]*\.[a-z]*$/
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    myPosts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Post'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;