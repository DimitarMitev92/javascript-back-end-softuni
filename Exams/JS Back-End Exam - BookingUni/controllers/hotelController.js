const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware.js');
const { preloadHotel, isHotelOwner } = require('../middlewares/hotelMiddleware.js');
const hotelService = require('../services/hotelService.js');
const { getErrorMessage } = require('../utils/errorUtils.js');

const authService = require('../services/authService.js');

router.get('/create', isAuth, (req, res) => {
    res.render('hotel/create');
});

router.post('/create', isAuth, async (req, res) => {
    const hotelData = { ...req.body, owner: req.user._id };
    try {
        await hotelService.create(hotelData);

        const user = await authService.findById(req.user._id);
        const hotel = await hotelService.findOneByName(req.body.name);

        user.offeredHotels.push(hotel._id);

        await user.save();

        res.redirect('/');
    } catch (error) {
        res.render('hotel/create', { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/:hotelId/details', async (req, res) => {
    try {
        const hotel = await hotelService.getOneWithDetailed(req.params.hotelId).lean();
        const isLoggedIn = Boolean(req.user);
        const isOwner = hotel.owner._id.toString() === req.user?._id;
        const isBook = hotel.usersBooked.some(booking => booking._id.toString() === req.user?._id);

        res.render('hotel/details', { ...hotel, isLoggedIn, isOwner, isBook });
    } catch (error) {
        res.redirect('home/404');
    }
});

router.get(
    '/:hotelId/edit',
    isAuth,
    preloadHotel,
    isHotelOwner,
    (req, res) => {
        res.render('hotel/edit', { ...req.hotel });
    }
);

router.post(
    '/:hotelId/edit',
    isAuth,
    preloadHotel,
    isHotelOwner,
    async (req, res) => {
        try {
            await hotelService.updateOne(req.params.hotelId, req.body);
            res.redirect(`/hotel/${req.params.hotelId}/details`);
        } catch (error) {
            res.render('hotel/edit', { ...req.body, error: getErrorMessage(error) });
        }
    }
);

router.get(
    '/:hotelId/delete',
    isAuth,
    preloadHotel,
    isHotelOwner,
    async (req, res) => {
        await hotelService.delete(req.params.hotelId);
        res.redirect('/');
    }
);

router.get('/:hotelId/book', isAuth, async (req, res) => {
    const hotel = await hotelService.getOne(req.params.hotelId);

    const user = await authService.findById(req.user._id);

    hotel.usersBooked.push(req.user._id);

    user.bookedHotels.push(req.params.hotelId);

    hotel.freeRooms--;

    await hotel.save();
    await user.save();

    res.redirect(`/hotel/${req.params.hotelId}/details`);
});


module.exports = router;