const Publication = require('../models/Publication.js');
const User = require('../models/User.js');

exports.create = (publicationData) => Publication.create(publicationData);

exports.getAll = () => Publication.find();

exports.getOne = (publicationId) => Publication.findById(publicationId);

exports.getOneWithDetailed = (publicationId) => Publication.findById(publicationId).populate('author');

exports.updateOne = (publicationId, publicationData) => Publication.updateOne({ _id: publicationId }, { $set: publicationData }, { runValidators: true });

exports.delete = (publicationId) => Publication.findByIdAndDelete(publicationId);