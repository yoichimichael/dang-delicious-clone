const passport = require('passport');
const crypto = require('crypto'); 
const mongoose = require('mongoose');
// const { promisify } = require('util'); // where is this from??
const User = mongoose.model('User');
const promisify = require('es6-promisify');

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
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    // $gt is the MondoDB operator for 'greater than'
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login')
  }
  // if there is a user, show the reset password form
  res.render('reset', { title: 'Reset your Password' })
}

exports.confirmedPasswords = (req, res, next) => {
  // need to use square brackets to acces password-confirm property because of the dash
  // can't use dot notation
  if (req.body.password === req.body['password-confirm']){
    next(); // keep it going
    return;
  }
  req.flash('error', 'Passwords do not match!');
  res.redirect('back');
}

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    // $gt is the MondoDB operator for 'greater than'
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login')
  }

  // available via passport plugin on User.js
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();

  // another passport.js feature
  // automatically logs in user based on passed object
  await req.login(updatedUser);
  req.flash('success', '💃🏻 Nice! Your Password has been reset! You are now logged in!')
  res.redirect('/');
}