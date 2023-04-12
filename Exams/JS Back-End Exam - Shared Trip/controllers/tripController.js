const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware.js');
const { preloadTrip, isTripOwner } = require('../middlewares/tripMiddleware.js');
const tripService = require('../services/tripService.js');
const authService = require('../services/authService.js');
const { getErrorMessage } = require('../utils/errorUtils.js');

router.get('/create', isAuth, async (req, res) => {
    res.render('trip/create', { email: req.user?.email });
});

router.post('/create', isAuth, async (req, res) => {
    const tripData = { ...req.body, owner: req.user._id };
    try {
        const trip = await tripService.create(tripData);

        let user = await authService.findById(req.user._id);
        user.tripsHistory.push(trip._id);

        await user.save();

        res.redirect('/trips/catalog');
    } catch (error) {
        res.render('trip/create', { ...req.body, error: getErrorMessage(error), email: req.user?.email });
    }
});

router.get('/catalog', async (req, res) => {
    const allTrips = await tripService.getAll().lean();
    res.render('trip/catalog', { trips: allTrips, email: req.user?.email });
});

router.get('/:tripId/details', async (req, res) => {
    try {
        const trip = await tripService.getOneWithDetailed(req.params.tripId).lean();

        const isLoggedIn = Boolean(req.user);
        const isOwner = trip.owner._id.toString() === req.user?._id;
        const isJoin = trip.buddies.some(joiner => joiner._id.toString() === req.user?._id);
        const isAvailableSeats = Boolean(trip.seats > 0);
        const buddies = trip.buddies.map(passenger => passenger = passenger.email).join(', ');
        res.render('trip/details', { ...trip, isLoggedIn, isOwner, isJoin, isAvailableSeats, buddies, email: req.user?.email });
    } catch (error) {
        res.redirect('home/404');
    }
});

router.get('/:tripId/edit', isAuth, preloadTrip, isTripOwner, (req, res) => {
    res.render('trip/edit', { ...req.trip, email: req.user?.email });
});

router.post('/:tripId/edit', isAuth, preloadTrip, isTripOwner, async (req, res) => {
    try {
        await tripService.updateOne(req.params.tripId, req.body);
        res.redirect(`/trips/${req.params.tripId}/details`);
    } catch (error) {
        res.render('trip/edit', { ...req.body, error: getErrorMessage(error), email: req.user?.email });
    }
});

router.get('/:tripId/delete', isAuth, preloadTrip, isTripOwner, async (req, res) => {
    await tripService.delete(req.params.tripId);
    res.redirect('/trips/catalog');
});

router.get('/:tripId/join', isAuth, async (req, res) => {
    const trip = await tripService.getOne(req.params.tripId);
    trip.buddies.push(req.user._id);
    trip.seats--;
    await trip.save();
    res.redirect(`/trips/${req.params.tripId}/details`);
});

router.get('/profile', isAuth, async (req, res) => {
    const user = await authService.findByIdDetailer(req.user._id).lean();
    const trips = user.tripsHistory;
    const countTrips = trips.length;
    const isMale = Boolean(user.gender === 'male');
    console.log(user);
    res.render('trip/profile', { user: user, trips, isMale, countTrips, email: req.user?.email });
});



module.exports = router;