const passport = require('passport');
const crypto = require('crypto'); 
const mongoose = require('mongoose');
const User = mongoose.model('User');

// if passport isn't able to authenticate, will redirect and flash
exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  
  // note that, like with logout, the flash messages are not flashing when expected (at page redirect)
  successRedirect: '/',
  successFlash: 'You are now logged in'
})

exports.logout = (req, res) => {

  // see flash issue above
  req.logout();
  req.flash('success', 'You are now logged out! 👋🏼');
  res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
  // first check if user is authenticated
  if (req.isAuthenticated()){
    next(); // continue, they are logged in!
    return;
  }
  req.flash('error', 'Oops you must be logged in to do that!');
  res.redirect('/login');
}

exports.forgot = async (req, res) => {
  // 1. see if a user with that email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'A password reset has been mailed to you.');
    return res.redirect('/login');
  }
  
  // 2. set reset tokens and expiry on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1hr from 'now'
  await user.save();

  // 3. send them an email with a token
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`; // if not hosted, directs to localhost
  req.flash('success', `You have been emailed a password reset link. ${resetURL}`);
  // 4. redirect to login page
  res.redirect('/login'); 
}

exports.reset = async (req, res) => {
  
}