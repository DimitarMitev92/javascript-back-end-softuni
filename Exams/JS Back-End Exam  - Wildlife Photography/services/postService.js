const Post = require('../models/Post.js');

exports.create = (postData) => Post.create(postData);

exports.getOne = (postId) => Post.findById(postId);

exports.getAll = () => Post.find();

exports.getOneWithDetailed = (postId) => Post.findById(postId).populate('owner').populate('votesPost');

exports.updateOne = (postId, postData) => Post.updateOne({
    _id: postId
}, { $set: postData }, { runValidators: true });

exports.delete = (postId) => Post.findByIdAndDelete(postId);

