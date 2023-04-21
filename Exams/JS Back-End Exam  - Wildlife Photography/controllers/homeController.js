const router = require('express').Router();

const postService = require('../services/postService.js');

router.get('/', async (req, res) => {
    const allPosts = await postService.getAll().lean();
    res.render('home', { posts: allPosts, email: req.user?.email });
});

module.exports = router;