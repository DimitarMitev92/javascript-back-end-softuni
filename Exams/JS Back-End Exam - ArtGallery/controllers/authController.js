const router = require('express').Router();

const authService = require('../services/authService.js');
const { COOKIE_SESSION_NAME } = require('../constants.js');
const { isAuth, isGuest } = require('../middlewares/authMiddleware.js');
const { getErrorMessage } = require('../utils/errorHelpers.js');

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isGuest, async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await authService.login(username, password);
        const token = await authService.createToken(user);

        res.cookie(COOKIE_SESSION_NAME, token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        //Add mongoose error mapper
        return res.render('auth/login', { error: getErrorMessage(error) });
    }

});

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

router.post('/register', isGuest, async (req, res) => {
    const { username, password, repeatPassword, address } = req.body;

    if (password !== repeatPassword) {
        return res.render('auth/register', { error: 'Password mismatch!' });
    }

    try {
        //Create user
        const createdUser = await authService.create({ username, password, address });
        const token = await authService.createToken(createdUser);

        res.cookie(COOKIE_SESSION_NAME, token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        //Add mongoose error mapper
        return res.render('auth/register', { error: getErrorMessage(error) });
    }

});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(COOKIE_SESSION_NAME);
    res.redirect('/');
});

module.exports = router;