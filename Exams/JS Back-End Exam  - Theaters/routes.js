const router = require('express').Router();

const homeController = require('./controllers/homeController.js');
const authController = require('./controllers/authController.js');
const notFoundController = require('./controllers/notFoundController.js');
const theaterController = require('./controllers/theaterController.js');

router.use(homeController);
router.use('/auth', authController);
router.use('/theater', theaterController);
router.use('*', notFoundController);

module.exports = router;