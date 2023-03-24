const router = require('express').Router();

const homeController = require('./controllers/homeController.js');
const authController = require('./controllers/authController.js');
const notFoundController = require('./controllers/notFoundController.js');
const petController = require('./controllers/petController.js');

router.use(homeController);
router.use('/auth', authController);
router.use('/pets', petController);
router.use('*', notFoundController);

module.exports = router;