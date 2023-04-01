const hotelService = require('../services/hotelService.js');

exports.preloadHotel = async (req, res, next) => {
    const hotel = await hotelService.getOne(req.params.hotelId).lean();
    req.hotel = hotel;
    next();
};

exports.isHotelOwner = (req, res, next) => {
    if (req.hotel.owner != req.user._id) {
        return next({ message: 'You are not authorized', status: 401 });
    }
    next();
};