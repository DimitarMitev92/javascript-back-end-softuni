const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    startPoint: {
        type: String,
        required: [true, 'Start point is required!']
    },
    endPoint: {
        type: String,
        required: [true, 'End point is required!']
    },
    date: {
        type: String,
        required: [true, 'Date is required!']
    },
    time: {
        type: String,
        required: [true, 'Time is required!']
    },
    carImage: {
        type: String,
        required: [true, 'Car image is required!']
    },
    carBrand: {
        type: String,
        required: [true, 'Car brand is required!']
    },
    seats: {
        type: Number,
        required: [true, 'Seats are required!']
    },
    price: {
        type: Number,
        required: [true, 'Price is required!']
    },
    description: {
        type: String,
        required: [true, 'Description is required!']
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    buddies: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;