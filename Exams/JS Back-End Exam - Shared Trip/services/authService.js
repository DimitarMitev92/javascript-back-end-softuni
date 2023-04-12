const User = require('../models/User.js');
const bcrypt = require('bcrypt');

const jwt = require('../lib/jsonwebtoken.js');
const { SECRET } = require('../constants.js');

exports.findByEmail = (email) => User.findOne({ email });

exports.findById = (userId) => User.findById(userId);

exports.findByIdDetailer = (userId) => User.findById(userId).populate('tripsHistory');

exports.register = async (email, password, repeatPassword, gender) => {
    if (password.length < 5) {
        throw new Error('Password is too short!');
    }

    if (password !== repeatPassword) {
        throw new Error('Password mismatch!');
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error('User exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ email, password: hashedPassword, gender });

    return this.login(email, password);
};

exports.login = async (email, password) => {
    const user = await this.findByEmail(email);

    if (!user) {
        throw new Error('Invalid username or password!');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid username or password');
    }

    const payload = {
        _id: user._id,
        email: email,
        gender: user.gender
    };

    const token = await jwt.sing(payload, SECRET);
    return token;
};