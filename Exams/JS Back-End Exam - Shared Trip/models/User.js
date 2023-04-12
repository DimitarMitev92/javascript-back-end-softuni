const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required!'],
        validate: /^[a-z]*\@[a-z]*\.[a-z]*$/
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    gender: {
        type: String,
        enum: ['female', 'male'],
        required: [true, 'Gender is required!']
    },
    tripsHistory: [{
        type: mongoose.Types.ObjectId,
        ref: 'Trip'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;