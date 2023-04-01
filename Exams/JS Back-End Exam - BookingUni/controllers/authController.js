const router = require('express').Router();

const authService = require('../services/authService.js');
const { isAuth } = require('../middlewares/authMiddleware.js');
const { getErrorMessage } = require('../utils/errorUtils.js');


router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const token = await authService.login(username, password);
        res.cookie('auth', token);
        res.redirect('/');
    } catch (error) {
        return res.status(400).render('auth/login', {
            error: getErrorMessage(error)
        });
    }
});

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    const { email, username, password, repeatPassword } = req.body;
    try {
        const token = await authService.register(email, username, password, repeatPassword);
        res.cookie('auth', token);
        res.redirect('/');
    } catch (error) {
        return res.status(400).render('auth/register', { error: getErrorMessage(error) });
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie('auth');
    res.redirect('/');
});

router.get('/profile', isAuth, async (req, res) => {
    const user = await authService.findByIdDetailed(req.user._id);
    const bookedHotels = user.bookedHotels.map(hotel => hotel = hotel.name).join(', ');
    res.render('auth/profile', { user, bookedHotels });
});

module.exports = router;