const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
};

// GET /books - List all books
router.get('/books', isLoggedIn, async (req, res) => {
    try {
        const books = await Book.find({});
        res.render('books/index', { books });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// GET /book/new - Show form to create a new book
router.get('/book/new', isLoggedIn, (req, res) => {
    res.render('books/new');
});

// POST /book - Create a new book
router.post('/book', isLoggedIn, async (req, res) => {
    try {
        const book = new Book(req.body.book);
        await book.save();
        res.redirect(`/books/${book._id}`);
    } catch (err) {
        console.log(err);
        res.redirect('/book/new');
    }
});

// GET /books/:id - Show details of one book
router.get('/books/:id', isLoggedIn, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.render('books/show', { book });
    } catch (err) {
        console.log(err);
        res.redirect('/books');
    }
});

// GET /books/:id/edit - Show edit form
router.get('/books/:id/edit', isLoggedIn, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.render('books/edit', { book });
    } catch (err) {
        console.log(err);
        res.redirect('/books');
    }
});

// PUT /books/:id - Update book
router.put('/books/:id', isLoggedIn, async (req, res) => {
    try {
        // Prevent title from being edited
        const { title, ...updateData } = req.body.book;

        await Book.findByIdAndUpdate(req.params.id, updateData, { runValidators: true });
        res.redirect(`/books/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.redirect(`/books/${req.params.id}/edit`);
    }
});

// DELETE /books/:id - Delete a book
router.delete('/books/:id', isLoggedIn, async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect('/books');
    } catch (err) {
        console.log(err);
        res.redirect('/books');
    }
});

module.exports = router;