const router = require('express').Router();

const homeController = require('./controllers/homeController.js');
const authController = require('./controllers/authController.js');
const notFoundController = require('./controllers/notFoundController.js');
const tripController = require('./controllers/tripController.js');

router.use(homeController);
router.use('/auth', authController);
router.use('/trips', tripController);
router.use('*', notFoundController);

module.exports = router;