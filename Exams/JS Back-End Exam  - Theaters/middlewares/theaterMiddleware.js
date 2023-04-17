const theaterService = require('../services/theaterService.js');

exports.preloadTheater = async (req, res, next) => {
    const theater = await theaterService.getOne(req.params.theaterId).lean();
    req.theater = theater;
    next();
};

exports.isTheaterOwner = (req, res, next) => {
    if (req.theater.owner != req.user._id) {
        return next({ message: 'You are not authorized!', status: 401 });
    }
    next();
};