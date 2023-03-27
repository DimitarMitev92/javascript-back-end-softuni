const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: [true, 'Email is required!'],
        minLength: 10
    },
    username: {
        type: String,
        require: [true, 'Username is required!'],
        minLength: 4
    },
    password: {
        type: String,
        require: [true, 'Password is required!'],
        minLength: 3
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;