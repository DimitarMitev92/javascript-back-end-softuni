const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        validate: /^[A-Za-z0-9@]*$/
    },
    username: {
        type: String,
        required: [true, 'Username is required!'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
    },
    bookedHotels: [{
        type: mongoose.Types.ObjectId,
        ref: 'Hotel'
    }],
    offeredHotels: [{
        type: mongoose.Types.ObjectId,
        ref: 'Hotel'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;