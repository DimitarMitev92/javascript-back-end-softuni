const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Full name is required!'],
        validate: /^[A-Z][a-z]+ [A-Z][a-z]+$/
    },
    username: {
        type: String,
        required: [true, 'Username is required!'],
        minLength: 5
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minLength: 4
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;