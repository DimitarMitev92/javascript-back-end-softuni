const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        minLength: 2
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        minLength: 10
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    myPets: [{
        type: mongoose.Types.ObjectId,
        ref: 'Pet'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;