const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        unique: true,
        minLength: 3,
        validate: /^[A-Za-z0-9]*$/
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    likedPlays: [{
        type: mongoose.Types.ObjectId,
        ref: 'Theater'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;