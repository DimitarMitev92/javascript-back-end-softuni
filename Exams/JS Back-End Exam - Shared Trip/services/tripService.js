const Trip = require('../models/Trip.js');

exports.create = (tripData) => Trip.create(tripData);

exports.getOne = (tripId) => Trip.findById(tripId);

exports.getAll = () => Trip.find();

exports.updateOne = (tripId, tripData) => Trip.updateOne({ _id: tripId }, { $set: tripData }, { runValidators: true });

exports.getOneWithDetailed = (tripId) => Trip.findById(tripId).populate('owner').populate('buddies');

exports.delete = (tripId) => Trip.findByIdAndDelete(tripId)

