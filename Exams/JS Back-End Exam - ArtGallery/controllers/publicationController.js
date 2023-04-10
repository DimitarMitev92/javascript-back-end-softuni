const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware.js');
const { isPublicationAuthor, preloadPublication } = require('../middlewares/publicationMiddlewares.js');
const publicationService = require('../services/publicationService.js');
const userService = require('../services/userService.js');
const { getErrorMessage } = require('../utils/errorHelpers.js');

router.get('/create', isAuth, (req, res) => {
    res.render('publication/create');
});

router.post('/create', isAuth, async (req, res) => {
    const publicationData = { ...req.body, author: req.user._id };
    try {
        const publication = await publicationService.create(publicationData);
        await userService.addPublication(req.user._id, publication._id);
        res.redirect('/publications/gallery');

    } catch (error) {
        res.render('publication/create', { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/gallery', async (req, res) => {
    const publications = await publicationService.getAll().lean();
    res.render('publication/gallery', { publications: publications });
});

router.get('/:publicationId/details', async (req, res) => {
    const publication = await publicationService.getOneWithDetailed(req.params.publicationId).lean();
    const isAuthor = publication.author._id.toString() === req.user?._id;
    const isShared = publication.userShared.map(shared => shared.toString()).includes(req.user._id);
    res.render('publication/details', { ...publication, isAuthor, isShared });
});


router.get(
    '/:publicationId/edit',
    isAuth,
    preloadPublication,
    isPublicationAuthor,
    (req, res) => {
        res.render('publication/edit', { ...req.publication });
    });

router.post(
    '/:publicationId/edit',
    isAuth,
    preloadPublication,
    isPublicationAuthor,
    async (req, res) => {
        try {

            await publicationService.updateOne(req.params.publicationId, req.body);

            res.redirect(`/publications/${req.params.publicationId}/details`);
        } catch (error) {
            res.render('publication/edit', { ...req.body, error: getErrorMessage(error) });

        }
    });

router.get(
    '/:publicationId/delete',
    isAuth,
    preloadPublication,
    isPublicationAuthor,
    async (req, res) => {

        await publicationService.delete(req.params.publicationId);
        res.redirect('/publications/gallery');
    });

router.get('/:publicationId/delete', isAuth, async (req, res) => {
    await publicationService.delete(req.params.publicationId);
    const publications = await publicationService.getAll().lean();
    res.render('publication/gallery', { publications: publications });

});

router.get('/:publicationId/share', isAuth, async (req, res) => {
    const publication = await publicationService.getOne(req.params.publicationId);
    //add shares
    const user = await userService.getOne(req.user._id);
    //
    publication.userShared.push(req.user._id);
    //add shares
    user.shares.push(publication);
    //
    await publication.save();
    //add shares
    await user.save();
    //
    res.redirect('/');
});

module.exports = router;