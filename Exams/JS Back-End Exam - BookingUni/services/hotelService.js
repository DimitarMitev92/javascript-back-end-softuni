const Hotel = require('../models/Hotel.js');

exports.create = (hotelData) => Hotel.create(hotelData);

exports.getOne = (hotelId) => Hotel.findById(hotelId);

exports.getOneWithDetailed = (hotelId) => Hotel.findById(hotelId).populate('owner').populate('usersBooked');

exports.getAll = () => Hotel.find();

exports.updateOne = (hotelId, hotelData) => Hotel.updateOne({ _id: hotelId }, { $set: hotelData }, { runValidators: true });

exports.delete = (hotelId) => Hotel.findByIdAndDelete(hotelId);

exports.findOneByName = (name) => Hotel.findOne({ name: name });
