const router = require('express').Router();

const theaterService = require('../services/theaterService.js');

router.get('/', async (req, res) => {

    const theaters = await theaterService.getAll().lean();
    if (req.user) {
        const sortedArrByTime = theaters.sort((a, b) => b.createdAt - a.createdAt).map(x => x = { ...x, likes: x.usersLiked.length });
        res.render('home/userHome', { theaters: sortedArrByTime });
    } else {
        const sortedArrByLikes = theaters.sort((a, b) => b.usersLiked.length - a.usersLiked.length).slice(0, 2);
        res.render('home/guestHome', { theaters: sortedArrByLikes });
    }
});

module.exports = router;