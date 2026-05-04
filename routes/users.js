const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Show register form
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Handle register logic
router.post('/register', async (req, res, next) => {
    try {
        const { username, password, favoriteAuthor } = req.body;
        const user = new User({ username, favoriteAuthor });
        const registeredUser = await User.register(user, password);

        // Log in the user after registration
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/books');
        });
    } catch (err) {
        console.log(err);
        res.redirect('/register');
    }
});

// Show login form
router.get('/login', (req, res) => {
    res.render('users/login');
});

// Handle login logic
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    keepSessionInfo: true
}), (req, res) => {
    res.redirect('/books');
});

// Handle logout logic
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

module.exports = router;