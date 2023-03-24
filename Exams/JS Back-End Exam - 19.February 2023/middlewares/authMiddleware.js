const jwt = require('../lib/jsonwebtoken.js');
const { SECRET } = require('../constants.js');


exports.authentication = async (req, res, next) => {
    const token = req.cookies['auth'];

    if (token) {
        try {
            const decodedToken = await jwt.verify(token, SECRET);
            //All information (decodedToken) attach to req.user
            req.user = decodedToken;
            res.locals.isAuthenticated = true;
            res.locals.user = decodedToken;
        } catch (error) {
            res.clearCookie('auth');
            return res.status(401).render('home/404');
        }
    }
    next();
};

exports.isAuth = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    next();
};