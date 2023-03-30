const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware.js');

const { preloadCrypto, isCryptoOwner } = require('../middlewares/cryptoMiddleware.js');
const cryptoService = require('../services/cryptoService.js');
const { getErrorMessage } = require('../utils/errorUtils.js');


router.get('/create', isAuth, (req, res) => {
    res.render('crypto/create');
});


router.post('/create', isAuth, async (req, res) => {
    const cryptoData = { ...req.body, owner: req.user._id };
    try {
        const crypto = await cryptoService.create(cryptoData);
        res.redirect('/cryptos/catalog');
    } catch (error) {
        res.render('crypto/create', { ...req.body, error: getErrorMessage(error) });
    }
});



router.get('/catalog', async (req, res) => {
    const allCryptos = await cryptoService.getAll().lean();
    res.render('crypto/catalog', { cryptos: allCryptos });
});

router.get('/:cryptoId/details', async (req, res) => {
    try {
        const crypto = await cryptoService.getOneWithDetailed(req.params.cryptoId).lean();
        const isLoggedIn = Boolean(req.user);
        const isOwner = crypto.owner._id.toString() === req.user?._id;
        const isBuyed = crypto.buyCrypto.map(buy => buy.toString()).includes(req.user?._id);
        res.render('crypto/details', { ...crypto, isLoggedIn, isOwner, isBuyed });
    } catch (error) {
        res.redirect('home/404');
    }
});

router.get(
    '/:cryptoId/edit',
    isAuth,
    preloadCrypto,
    isCryptoOwner,
    (req, res) => {
        res.render('crypto/edit', { ...req.crypto });
    });

router.post(
    '/:cryptoId/edit',
    isAuth,
    preloadCrypto,
    isCryptoOwner,
    async (req, res) => {
        try {
            await cryptoService.updateOne(req.params.cryptoId, req.body);
            res.redirect(`/cryptos/${req.params.cryptoId}/details`);
        } catch (error) {
            res.render(`crypto/edit`, { ...req.body, error: getErrorMessage(error) });
        }
    });

router.get(
    '/:cryptoId/delete',
    isAuth,
    preloadCrypto,
    isCryptoOwner,
    async (req, res) => {
        await cryptoService.delete(req.params.cryptoId);
        res.redirect('/cryptos/catalog');
    }
);

router.get('/:cryptoId/buy', isAuth, async (req, res) => {
    const crypto = await cryptoService.getOne(req.params.cryptoId);
    crypto.buyCrypto.push(req.user._id);
    await crypto.save();
    res.redirect(`/cryptos/${req.params.cryptoId}/details`);

});

router.get('/search', async (req, res) => {
    const cryptos = await cryptoService.getAll().lean();
    res.render('crypto/search', { cryptos });
});

router.post('/search', async (req, res) => {
    const { searchCoin, payment } = req.body;

    const cryptos = await cryptoService.getByCriteria(searchCoin, payment).collation({ locale: 'en_US', strength: 1 }).lean();
    res.render('crypto/search', { cryptos });

});



module.exports = router;