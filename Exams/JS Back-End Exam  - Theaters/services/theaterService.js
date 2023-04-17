const Theater = require('../models/Theater.js');

exports.create = (theaterData) => Theater.create(theaterData);

exports.getOne = (theaterId) => Theater.findById(theaterId);

exports.getAll = () => Theater.find();

exports.updateOne = (theaterId, theaterData) => Theater.updateOne({ _id: theaterId }, { $set: theaterData }, { runValidators: true });

exports.getOneWithDetailed = (theaterId) => Theater.findById(theaterId).populate('owner').populate('usersLiked');

exports.delete = (theaterId) => Theater.findByIdAndDelete(theaterId);