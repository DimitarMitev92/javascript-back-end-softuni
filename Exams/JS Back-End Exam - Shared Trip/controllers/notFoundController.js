const router = require('express').Router();

router.get('*', (req, res) => {
    res.render('home/404');
});

module.exports = router;