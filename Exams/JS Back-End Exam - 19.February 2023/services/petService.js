const Pet = require('../models/Pet.js');

exports.create = (petData) => Pet.create(petData);

exports.getOne = (petId) => Pet.findById(petId);

exports.getAll = () => Pet.find();

exports.getAllDetailed = () => Pet.find().populate('owner').populate('commentList');

exports.getOneWithDetailed = (petId) => Pet.findById(petId).populate('owner').populate('commentList');

exports.updateOne = (petId, petData) => Pet.updateOne({
    _id: petId
}, { $set: petData }, { runValidators: true });

exports.delete = (petId) => Pet.findByIdAndDelete(petId);