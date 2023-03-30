const Crypto = require('../models/Crypto.js');

exports.create = (cryptoData) => Crypto.create(cryptoData);

exports.getAll = () => Crypto.find();

exports.getOne = (cryptoId) => Crypto.findById(cryptoId);

exports.getOneWithDetailed = (cryptoId) => Crypto.findById(cryptoId).populate('owner');

exports.updateOne = (cryptoId, cryptoData) => Crypto.updateOne({ _id: cryptoId }, { $set: cryptoData }, { runValidators: true });

exports.delete = (cryptoId) => Crypto.findByIdAndDelete(cryptoId);

exports.getByCriteria = (searchCoin, payment) => Crypto.find({ name: searchCoin, payment: payment }); 