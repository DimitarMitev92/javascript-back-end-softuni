const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware.js');
const { preloadPet, isPetOwner } = require('../middlewares/petMiddleware.js');
const petSService = require('../services/petService.js');

//BONUS: My profile
const authService = require('../services/authService.js');
//

const { getErrorMessage } = require('../utils/errorUtils.js');

router.get('/create', isAuth, (req, res) => {
    res.render('pet/create');
});

router.post('/create', isAuth, async (req, res) => {
    const petData = { ...req.body, owner: req.user._id };
    try {
        const pet = await petSService.create(petData);

        //BONUS: my profile
        let user = await authService.findById(req.user._id);
        user.myPets.push(pet._id);
        await user.save();

        res.redirect('/pets/catalog');
    } catch (error) {
        res.render('pet/create', { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/catalog', async (req, res) => {
    const pets = await petSService.getAllDetailed().lean();
    res.render('pet/catalog', { pets: pets });
});

router.get('/:petId/details', async (req, res) => {
    try {
        const pet = await petSService.getOneWithDetailed(req.params.petId).lean();
        const isLoggedIn = Boolean(req.user);
        const isOwner = pet.owner._id.toString() === req.user?._id;


        const comments = pet.commentList;
        console.log(comments);


        res.render('pet/details', { ...pet, isLoggedIn, isOwner, comments });
    } catch (error) {
        res.redirect('home/404');
    }
});

router.get(
    '/:petId/edit',
    isAuth,
    preloadPet,
    isPetOwner,
    (req, res) => {
        res.render('pet/edit', { ...req.pet });
    }
);

router.post(
    '/:petId/edit',
    isAuth,
    preloadPet,
    isPetOwner,
    async (req, res) => {
        try {
            await petSService.updateOne(req.params.petId, req.body);
            res.redirect(`/pets/${req.params.petId}/details`);
        } catch (error) {
            res.render('pet/edit', { ...req.body, error: getErrorMessage(error) });
        }
    }
);

router.get(
    '/:petId/delete',
    isAuth,
    preloadPet,
    isPetOwner,
    async (req, res) => {
        await petSService.delete(req.params.petId);
        res.redirect('/pets/catalog');
    }
);


router.post('/:petId/comment', isAuth, async (req, res) => {
    try {
        const pet = await petSService.getOneWithDetailed(req.params.petId);
        const userId = req.user._id;
        const username = req.user.username;
        const comment = req.body.comment;
        pet.commentList.push({ userId, username, comment });
        await pet.save();
        res.redirect(`/pets/${req.params.petId}/details`);
    } catch (error) {
        res.redirect('home/404');
    }

});


router.get('/profile', isAuth, async (req, res) => {
    try {

        const user = await authService.findByIdDetailed(req.user._id).lean();
        console.log(user);
        const myPets = user.myPets;
        const photosNum = myPets.length;
        console.log(myPets);
        res.render('pet/profile', { ...user, photosNum, myPets: myPets });
    } catch (error) {
        res.redirect('home/404');
    }

});

module.exports = router;