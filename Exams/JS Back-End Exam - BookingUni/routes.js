const router = require('express').Router();

const homeController = require('./controllers/homeController.js');
const authController = require('./controllers/authController.js');
const notFoundController = require('./controllers/notFoundController.js');
const hotelController = require('./controllers/hotelController.js');

router.use(homeController);
router.use('/auth', authController);
router.use('/hotel', hotelController);
router.use('*', notFoundController);

module.exports = router;