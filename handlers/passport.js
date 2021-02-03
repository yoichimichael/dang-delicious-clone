const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

// can use because of plugin in User.js
passport.use(User.createStrategy());

// a
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());