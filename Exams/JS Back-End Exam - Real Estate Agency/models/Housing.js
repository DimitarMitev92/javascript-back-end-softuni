const mongoose = require('mongoose');

const housingSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required!'],
        minLength: 6
    },
    type: {
        type: String,
        enum: ['Apartment', 'Villa', 'House'],
        required: [true, 'Property Type is required!']
    },
    year: {
        type: Number,
        required: [true, 'Year Built is required!'],
        min: 1850,
        max: 2021
    },
    city: {
        type: String,
        required: [true, 'City is required!'],
        minLength: 4
    },
    homeImage: {
        type: String,
        required: [true, 'Home Image is required!'],
        validate: /^https?:\/\//
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        maxLength: 60
    },
    availablePieces: {
        type: Number,
        required: [true, 'Available Pieces are required!'],
        min: 0,
        max: 10
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    peopleRented: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }]
});

const Housing = mongoose.model('Housing', housingSchema);

module.exports = Housing;