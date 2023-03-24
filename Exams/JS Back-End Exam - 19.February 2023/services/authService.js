const User = require('../models/User.js');
const bcrypt = require('bcrypt');

const jwt = require('../lib/jsonwebtoken.js');
const { SECRET } = require('../constants.js');

exports.findByUsername = (username) => User.findOne({ username });

exports.findById = (userId) => User.findById(userId);
exports.findByIdDetailed = (userId) => User.findById(userId).populate('myPets');

exports.register = async (username, email, password, repeatPassword) => {
    if (password.length <= 3) {
        throw new Error('Password is too short!');
    }


    if (password !== repeatPassword) {
        throw new Error('Password mismatch!');
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        throw new Error('User exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ username, email, password: hashedPassword });

    return this.login(username, password);
};

exports.login = async (username, password) => {
    const user = await this.findByUsername(username);

    if (!user) {
        throw new Error('Invalid username or password!');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid username or password');
    }

    const payload = {
        _id: user._id,
        email: user.email,
        username: username
    };

    const token = await jwt.sing(payload, SECRET);
    return token;
};