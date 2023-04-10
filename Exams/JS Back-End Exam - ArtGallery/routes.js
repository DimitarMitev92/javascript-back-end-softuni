const router = require('express').Router();

const homeController = require('./controllers/homeController.js');
const authController = require('./controllers/authController.js');
const publicationController = require('./controllers/publicationController.js');

//Every request passes through homeController
router.use(homeController);
router.use('/auth', authController);
router.use('/publications', publicationController);

module.exports = router;