const jwt = require('jsonwebtoken');
const { COOKIE_SESSION_NAME } = require('../constants.js');
const { SECRET } = require('../config/env.js');

//validate is it have a token or not
exports.auth = (req, res, next) => {
    const token = req.cookies[COOKIE_SESSION_NAME];

    if (token) {
        jwt.verify(token, SECRET, (err, decodedToken) => {
            if (err) {
                res.clearCookie(COOKIE_SESSION_NAME);
                // return next(err);
                return res.redirect('/auth/login');
            }

            req.user = decodedToken;
            //easy way to get it in layouts hbs
            res.locals.user = decodedToken;

            next();
        });
    } else {
        next();
    }
};

exports.isAuth = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    next();
};

exports.isGuest = (req, res, next) => {
    if (req.user) {
        return res.redirect('/');
    }
    next();
};
