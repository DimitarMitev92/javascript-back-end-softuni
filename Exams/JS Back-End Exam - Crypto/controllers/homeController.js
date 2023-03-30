const router = require('express').Router();

const cryptoService = require('../services/cryptoService.js');

router.get('/', async (req, res) => {
    const cryptos = await cryptoService.getAll().lean();
    res.render('home', { cryptos });
});

module.exports = router;