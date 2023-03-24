const petService = require('../services/petService.js');

exports.preloadPet = async (req, res, next) => {
    const pet = await petService.getOne(req.params.petId).lean();
    req.pet = pet;
    next();
};

exports.isPetOwner = (req, res, next) => {
    if (req.pet.owner != req.user._id) {
        return next({ message: 'You are not authorized', status: 401 });
    }
    next();
};