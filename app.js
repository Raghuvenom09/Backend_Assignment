const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// Route imports
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/bookManagerApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MONGO CONNECTION OPEN!");
}).catch(err => {
    console.log("MONGO CONNECTION ERROR!");
    console.log(err);
});

// Basic Express configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global variable middleware for views (so we can show the logged in user)
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// Use Routes
app.use('/', userRoutes);
app.use('/', bookRoutes);

// Home route
app.get('/', (req, res) => {
    res.redirect('/books');
});

// Start server
app.listen(3000, () => {
    console.log('Serving on port 3000');
});