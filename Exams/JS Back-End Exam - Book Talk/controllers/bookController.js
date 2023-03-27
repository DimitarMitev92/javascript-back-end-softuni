const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware.js');
const { preloadBook, isBookOwner } = require('../middlewares/bookMiddleware.js');
const bookService = require('../services/bookService.js');
const { getErrorMessage } = require('../utils/errorUtils.js');

router.get('/create', isAuth, (req, res) => {
    res.render('book/create');
});

router.post('/create', isAuth, async (req, res) => {
    const bookData = { ...req.body, owner: req.user._id };
    try {
        await bookService.create(bookData);
        res.redirect('/books/catalog');
    } catch (error) {
        res.render('book/create', { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/catalog', async (req, res) => {
    const allBooks = await bookService.getAll().lean();
    res.render('book/catalog', { books: allBooks });
});

router.get('/:bookId/details', async (req, res) => {
    try {
        const book = await bookService.getOneWithDetailed(req.params.bookId).lean();
        const isLoggedIn = Boolean(req.user);
        const isOwner = book.owner._id.toString() === req.user?._id;
        const isWish = book.wishingList.some(wisher => wisher._id.toString() === req.user?._id);
        res.render('book/details', { ...book, isLoggedIn, isOwner, isWish });
    } catch (error) {
        res.redirect('home/404');
    }
});

router.get('/:bookId/edit',
    isAuth,
    preloadBook,
    isBookOwner,
    (req, res) => {
        res.render('book/edit', { ...req.book });
    });


router.post('/:bookId/edit', isAuth, preloadBook, isBookOwner, async (req, res) => {
    try {
        await bookService.updateOne(req.params.bookId, req.body);
        res.redirect(`/books/${req.params.bookId}/details`);
    } catch (error) {
        res.render('book/edit', { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/:bookId/delete', isAuth, preloadBook, isBookOwner, async (req, res) => {
    await bookService.delete(req.params.bookId);
    res.redirect('/books/catalog');
});

router.get('/:bookId/wish', isAuth, async (req, res) => {
    const book = await bookService.getOne(req.params.bookId);
    book.wishingList.push(req.user._id);
    await book.save();
    res.redirect(`/books/${req.params.bookId}/details`);
});

//TODO
router.get('/profile', isAuth, async (req, res) => {
    console.log(req.user._id);
    const allBooksDetailed = await bookService.getAllWithDetails();
    const wishedBooks = allBooksDetailed.filter(book => book.wishingList[0]?._id.toString() === req.user._id);
    console.log(wishedBooks);
    res.render('book/profile', { wishedBooks, email: req.user.email });
});

module.exports = router;
