const router = require('express').Router();

const housingService = require('../services/housingService.js');

router.get('/', async (req, res) => {
    const allHousing = await housingService.getAll().lean();
    res.render('home', { housings: allHousing });
});

module.exports = router;