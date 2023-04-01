const router = require('express').Router();

const hotelService = require('../services/hotelService.js');

router.get('/', async (req, res) => {
    const allHotels = await hotelService.getAll().lean();
    res.render('home', { hotels: allHotels });
});

module.exports = router;