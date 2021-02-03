const passport = require('passport');

// if passport isn't able to authenticate, will redirect and flash
exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  
  // I have re-ordered these two method calls
  // with other sequence, Flash wouldn't occur at redirect, it would occur at another page navigation
  successFlash: 'You are now logged in',
  successRedirect: '/'
})

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out! 👋🏼');
  res.redirect('/');
}