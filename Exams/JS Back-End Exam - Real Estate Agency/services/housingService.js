const Housing = require('../models/Housing.js');

exports.create = (housingData) => Housing.create(housingData);

exports.getOne = (housingId) => Housing.findById(housingId);

exports.getAll = () => Housing.find();

exports.updateOne = (housingId, housingData) => Housing.updateOne({ _id: housingId }, { $set: housingData }, { runValidators: true });

exports.getOneWithDetailed = (housingId) => Housing.findById(housingId).populate('owner').populate('peopleRented');

exports.delete = (housingId) => Housing.findByIdAndDelete(housingId);

exports.getByCriteria = (searchingType) => Housing.find({ type: searchingType })





