const housingService = require('../services/housingService.js');

exports.preloadHousing = async (req, res, next) => {
    const housing = await housingService.getOne(req.params.housingId).lean();
    req.housing = housing;
    next();
};

exports.isHousingOwner = (req, res, next) => {
    if (req.housing.owner != req.user._id) {
        return next({ message: 'You are not authorized', status: 401 });
    }
    next();
};