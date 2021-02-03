const passport = require('passport');

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