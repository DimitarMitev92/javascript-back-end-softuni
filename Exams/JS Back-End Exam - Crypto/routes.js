const router = require('express').Router();

const homeController = require('./controllers/homeController.js');
const authController = require('./controllers/authController.js');
const cryptoController = require('./controllers/cryptoController.js');
const notFoundController = require('./controllers/notFoundController.js');

router.use(homeController);
router.use('/auth', authController);
router.use('/cryptos', cryptoController);
router.use('*', notFoundController);
module.exports = router;