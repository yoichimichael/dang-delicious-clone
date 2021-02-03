const mongoose = require('mongoose');
// can call on this because imported models, like Store, in start.js
const User = mongoose.model('User');
// library
const promisify = require('es6-promisify');

exports.loginForm = (req,  res) => {
  res.render('login', { title: 'Login'});
}

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
}

// all methods from express-validate
exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That Email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    // maybe look this one up
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirmed Password Cannot be Blank!').notEmpty();
  req.checkBody('password-confirm', 'Oops your passwords do not match!').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { 
      title: 'Register', 
      body: req.body, 
      flashes: req.flash() 
    });
    return;
  }
  next(); // there were no errors!
};

// passing next because this is not end of the road, which is actually logging in
exports.register = async (req, res, next) => {
  // access to form fields via inputs with connected name attributes
  const user = new User({ email: req.body.email, name: req.body.name });
  // promisify
  const register = promisify(User.register, User);

  // User.register(user, req.body.password, function(err, user) {
    // note that this method that doesn't use promisify doesn't return a promise, which we need to use async/await; instead use the promisify library
  // });

  await register(user, req.body.password);
  next(); // pass to authController.login

}