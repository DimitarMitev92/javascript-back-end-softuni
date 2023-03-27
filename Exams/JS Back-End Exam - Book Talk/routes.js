const router = require('express').Router();

const homeController = require('./controllers/homeController.js');
const authController = require('./controllers/authController.js');
const bookController = require('./controllers/bookController.js');
const notFoundController = require('./controllers/notFoundController.js');

router.use(homeController);
router.use('/auth', authController);
router.use('/books', bookController);
router.use('*', notFoundController);

module.exports = router;