const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware.js');
const { preloadTheater, isTheaterOwner } = require('../middlewares/theaterMiddleware.js');
const theaterService = require('../services/theaterService.js');
const authService = require('../services/authService.js');
const { getErrorMessage } = require('../utils/errorUtils.js');

router.get('/create', isAuth, (req, res) => {
    res.render('theater/create');
});

router.post('/create', isAuth, async (req, res) => {
    const theaterData = { ...req.body, owner: req.user._id };
    try {
        const theater = await theaterService.create(theaterData);

        let user = await authService.findById(req.user._id);
        user.likedPlays.push(theater._id);
        theater.createdAt = new Date();
        await user.save();
        await theater.save();
        res.redirect('/');
    } catch (error) {
        res.render('theater/create', { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/:theaterId/details', async (req, res) => {
    try {
        const theater = await theaterService.getOneWithDetailed(req.params.theaterId).lean();
        const isOwner = theater.owner._id.toString() === req.user?._id;
        const isLike = theater.usersLiked.some(liker => liker._id.toString() === req.user?._id);

        res.render('theater/details', { ...theater, isOwner, isLike });


    } catch (error) {
        res.redirect('home/404');
    }
});

router.get('/:theaterId/edit', isAuth, preloadTheater, isTheaterOwner, (req, res) => {
    const ifPublicChecked = req.theater.isPublic ? 'checked' : '';
    res.render('theater/edit', { ...req.theater, ifPublicChecked });
});

router.post('/:theaterId/edit', isAuth, preloadTheater, isTheaterOwner, async (req, res) => {
    try {

        req.body.isPublic = req.body.isPublic === 'on' ? true : false;
        await theaterService.updateOne(req.params.theaterId, req.body);
        res.redirect(`/theater/${req.params.theaterId}/details`);
    } catch (error) {
        res.render('theater/edit', { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/:theaterId/delete', isAuth, preloadTheater, isTheaterOwner, async (req, res) => {
    await theaterService.delete(req.params.theaterId);
    res.redirect('/');
});

router.get('/:theaterId/like', isAuth, async (req, res) => {
    const theater = await theaterService.getOne(req.params.theaterId);
    theater.usersLiked.push(req.user._id);
    await theater.save();
    res.redirect(`/theater/${req.params.theaterId}/details`);
});

router.get('/date', isAuth, async (req, res) => {
    const theaters = await theaterService.getAll().lean();
    const sortedArrByTime = theaters.sort((a, b) => a.createdAt - b.createdAt).map(x => x = { ...x, likes: x.usersLiked.length });
    res.render('home/userHome', { theaters: sortedArrByTime });
});

router.get('/likes', isAuth, async (req, res) => {
    const theaters = await theaterService.getAll().lean();
    const sortedArrByLikes = theaters.sort((a, b) => b.usersLiked.length - a.usersLiked.length).map(x => x = { ...x, likes: x.usersLiked.length });
    res.render('home/userHome', { theaters: sortedArrByLikes });
});



module.exports = router;