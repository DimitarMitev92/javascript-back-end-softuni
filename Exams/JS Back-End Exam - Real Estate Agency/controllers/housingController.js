const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware.js');
const { preloadHousing, isHousingOwner } = require('../middlewares/housingMiddleware.js');
const housingService = require('../services/housingService.js');
const { getErrorMessage } = require('../utils/errorUtils.js');

router.get('/create', isAuth, (req, res) => {
    res.render('housing/create');
});

router.post('/create', isAuth, async (req, res) => {
    const housingData = { ...req.body, owner: req.user._id };
    try {
        await housingService.create(housingData);
        res.redirect('/housing/rent');
    } catch (error) {
        res.render('housing/create', { ...req.body, error: getErrorMessage(error) });
    }
});


router.get('/rent', async (req, res) => {
    const allHousing = await housingService.getAll().lean();
    res.render('housing/rent', { housings: allHousing });
});

router.get('/:housingId/details', async (req, res) => {
    try {
        const housing = await housingService.getOneWithDetailed(req.params.housingId).lean();
        const isLoggedIn = Boolean(req.user);
        const isOwner = housing.owner._id.toString() === req.user?._id;
        const peopleRented = housing.peopleRented.map(renter => renter = renter.name).join(', ');
        const isRent = housing.peopleRented.some(renter => renter._id.toString() === req.user?._id);
        const isAvailablePieces = Boolean(housing.availablePieces > 0);

        res.render('housing/details', { ...housing, isLoggedIn, isOwner, peopleRented, isRent, isAvailablePieces, availablePieces: housing.availablePieces });
    } catch (error) {
        res.redirect('home/404');
    }
});

router.get(
    '/:housingId/edit',
    isAuth,
    preloadHousing,
    isHousingOwner,
    (req, res) => {
        res.render('housing/edit', { ...req.housing });
    });

router.post(
    '/:housingId/edit',
    isAuth,
    preloadHousing,
    isHousingOwner,
    async (req, res) => {
        try {
            await housingService.updateOne(req.params.housingId, req.body);
            res.redirect(`/housing/${req.params.housingId}/details`);
        } catch (error) {
            res.render('housing/edit', { ...req.body, error: getErrorMessage(error) });
        }
    }
);

router.get(
    '/:housingId/delete',
    isAuth,
    preloadHousing,
    isHousingOwner,
    async (req, res) => {
        await housingService.delete(req.params.housingId);
        res.redirect('/housing/rent');
    });

router.get('/:housingId/rent', isAuth, async (req, res) => {
    const housing = await housingService.getOne(req.params.housingId);
    housing.peopleRented.push(req.user._id);
    housing.availablePieces--;
    await housing.save();
    res.redirect(`/housing/${req.params.housingId}/details`);
});

router.get('/search', (req, res) => {
    res.render('housing/search', { isSearch: false });
});

router.post('/search', async (req, res) => {
    const { search } = req.body;

    const housings = await housingService.getByCriteria(search).collation({ locale: 'en_US', strength: 1 }).lean();
    res.render('housing/search', { housings, isSearch: true });
});

module.exports = router;
