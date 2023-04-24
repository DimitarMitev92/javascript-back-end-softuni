const User = require('../models/User.js');
const bcrypt = require('bcrypt');

const jwt = require('../lib/jsonwebtoken.js');
const { SECRET } = require('../constants.js');

exports.findByUsername = (username) => User.findOne({ username });

exports.register = async (name, username, password, repeatPassword) => {

    if (password !== repeatPassword) {
        throw new Error('Password mismatch!');
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        throw new Error('User exists');
    }

    if (password.length < 4) {
        throw new Error('Password is too short!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, username, password: hashedPassword });

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
        name: user.name,
        username: username
    };

    const token = await jwt.sing(payload, SECRET);
    return token;
};