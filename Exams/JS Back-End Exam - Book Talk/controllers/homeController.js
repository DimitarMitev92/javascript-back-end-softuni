const router = require('express').Router();

const bookService = require('../services/bookService.js');

router.get('/', async (req, res) => {
    const allBooks = await bookService.getAll().lean();
    res.render('home', { books: allBooks });
});

module.exports = router;