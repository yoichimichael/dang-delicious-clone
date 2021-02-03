const passport = require('passport');

// if passport isn't able to authenticate, will redirect and flash
exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in'
})

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out! 👋🏼');
  res.redirect('/');
}