const router = require('express').Router();

const homeController = require('./controllers/homeController.js');
const authController = require('./controllers/authController.js');
const notFoundController = require('./controllers/notFoundController.js');
const postController = require('./controllers/postController.js');

router.use(homeController);
router.use('/auth', authController);
router.use('/posts', postController);
router.use('*', notFoundController);

module.exports = router;