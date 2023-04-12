const tripService = require('../services/tripService.js');

exports.preloadTrip = async (req, res, next) => {
    const trip = await tripService.getOne(req.params.tripId).lean();
    req.trip = trip;
    next();
};

exports.isTripOwner = (req, res, next) => {
    if (req.trip.owner != req.user._id) {
        return next({ message: 'You are not authorized!', status: 401 });
    }
    next();
};