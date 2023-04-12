const router = require('express').Router();


router.get('/', async (req, res) => {
    res.render('home', { email: req.user?.email });
});

module.exports = router;