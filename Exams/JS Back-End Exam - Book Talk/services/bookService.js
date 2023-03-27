const Book = require('../models/Book.js');

exports.create = (bookId) => Book.create(bookId);

exports.getOne = (bookId) => Book.findById(bookId);

exports.getAll = () => Book.find();

exports.getOneWithDetailed = (bookId) => Book.findById(bookId).populate('owner').populate('wishingList');

exports.getAllWithDetails = () => Book.find().populate('owner').populate('wishingList');

exports.updateOne = (bookId, bookData) => Book.updateOne({ _id: bookId }, { $set: bookData }, { runValidators: true });

exports.delete = (bookId) => Book.findByIdAndDelete(bookId);