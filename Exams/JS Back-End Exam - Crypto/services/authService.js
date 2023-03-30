const User = require('../models/User.js');
const bcrypt = require('bcrypt');

const jwt = require('../lib/jsonwebtoken.js');
const { SECRET } = require('../constants.js');


exports.findByUsername = (username) => User.findOne({ username });

exports.findByEmail = (email) => User.findOne({ email });

exports.register = async (username, email, password, repeatPassword) => {

    if (password !== repeatPassword) {
        throw new Error('Password mismatch!');
    }

    //Check if the username or email exists
    //TODO: Look if it need in the task!!!!!
    // const existingUser = await this.findByUsername(username);
    const existingUser = await User.findOne({
        $or: [
            { email },
            { username },
        ]
    });

    if (existingUser) {
        throw new Error('User exists');
    }
    //TODO: Validate password in service not in model!!!
    //TODO FOR LENGTH VALIDATE THERE 
    //if(password.length < 4){
    // throw new Error('Password is too short!');
    // };

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ username, email, password: hashedPassword });

    return this.login(email, password);
};

exports.login = async (email, password) => {
    //User exists
    const user = await this.findByEmail(email);

    if (!user) {
        throw new Error('Invalid email or password!');
    }

    //Password is valid

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid email or password!');
    }

    //Generate token
    const payload = {
        _id: user._id,
        email,
        username: user.username
    };
    const token = await jwt.sign(payload, SECRET);
    return token;
};