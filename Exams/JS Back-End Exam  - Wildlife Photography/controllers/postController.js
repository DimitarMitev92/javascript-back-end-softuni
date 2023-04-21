const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware.js');
const { preloadPost, isPostOwner } = require('../middlewares/postMiddleware.js');
const postSService = require('../services/postService.js');

//BONUS: My profile
const authService = require('../services/authService.js');
//
const { getErrorMessage } = require('../utils/errorUtils.js');

router.get('/create', isAuth, (req, res) => {
    res.render('post/create', { email: req.user?.email });
});

router.post('/create', isAuth, async (req, res) => {
    const postData = { ...req.body, owner: req.user._id };
    try {
        const post = await postSService.create(postData);

        //BONUS: my profile
        let user = await authService.findById(req.user._id);
        user.myPosts.push(post._id);
        await user.save();

        res.redirect('/posts/catalog');
    } catch (error) {
        res.render('post/create', { ...req.body, error: getErrorMessage(error) });
    }
});


router.get('/catalog', async (req, res) => {
    const posts = await postSService.getAll().lean();
    res.render('post/catalog', { posts: posts, email: req.user?.email });
});

router.get('/:postId/details', async (req, res) => {
    try {
        const post = await postSService.getOneWithDetailed(req.params.postId).lean();
        const isLoggedIn = Boolean(req.user);
        const isOwner = post.owner._id.toString() === req.user?._id;

        const isVote = post.votesPost.some(poster => poster._id.toString() === req.user?._id);
        const ratingPost = post.ratingPost;
        const peopleVote = post.votesPost.map(voter => voter = voter.email).join(', ');
        res.render('post/details', { ...post, isLoggedIn, isOwner, isVote, ratingPost, peopleVote, email: req.user?.email });
    } catch (error) {
        res.redirect('home/404');
    }
});

router.get(
    '/:postId/edit',
    isAuth,
    preloadPost,
    isPostOwner,
    (req, res) => {
        res.render('post/edit', { ...req.post, email: req.user?.email });
    }
);

router.post(
    '/:postId/edit',
    isAuth,
    preloadPost,
    isPostOwner,
    async (req, res) => {
        try {
            await postSService.updateOne(req.params.postId, req.body);
            res.redirect(`/posts/${req.params.postId}/details`);
        } catch (error) {
            res.render('post/edit', { ...req.body, error: getErrorMessage(error) });
        }
    }
);

router.get(
    '/:postId/delete',
    isAuth,
    preloadPost,
    isPostOwner,
    async (req, res) => {
        await postSService.delete(req.params.postId);
        res.redirect('/posts/catalog');
    }
);

router.get('/:postId/upVote', isAuth, async (req, res) => {
    const post = await postSService.getOne(req.params.postId);
    post.votesPost.push(req.user._id);
    post.ratingPost++;
    await post.save();
    res.redirect(`/posts/${req.params.postId}/details`);
});

router.get('/:postId/downVote', isAuth, async (req, res) => {
    const post = await postSService.getOne(req.params.postId);
    post.votesPost.push(req.user._id);
    post.ratingPost--;
    await post.save();
    res.redirect(`/posts/${req.params.postId}/details`);
});

router.get('/myPosts', isAuth, async (req, res) => {
    const userDetailed = await authService.findByIdDetailed(req.user._id).lean();
    const allMyPost = userDetailed.myPosts;
    const fullName = `${req.user.firstName} ${req.user.lastName}`;
    console.log(allMyPost);
    let posts = allMyPost.map(post => post = { ...post, fullName: fullName });
    console.log(posts);
    res.render('post/myPosts', { posts, email: req.user?.email });
});

module.exports = router;