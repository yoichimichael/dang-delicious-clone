const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// object destructuring
// only importing the catchErrors function from errorHandlers.js
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
// note that res and req are implicitly passed to the 2nd argument functions
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', authController.isLoggedIn, storeController.addStore);

router.post(
  '/add', 
  storeController.upload, 
  catchErrors(storeController.resize), 
  catchErrors(storeController.createStore)
);

router.post(
  '/add/:id',
  storeController.upload, 
  catchErrors(storeController.resize), 
  catchErrors(storeController.updateStore));

router.get('/stores/:id/edit', catchErrors(storeController.editStore));

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);



// 1. validate the registration data
// 2. register the user
// 3. we need to log them in
router.post('/register', 
  userController.validateRegister,
  userController.register,
  authController.login  
);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot))
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post(
  '/account/reset/:token', 
  authController.confirmedPasswords, 
  catchErrors(authController.update)
);

router.get('/map', storeController.mapPage);

/*
-------
  API
-------
*/

router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));


// router.get('/', (req, res) => {
   
//   const peep = { name: "YO", age: 200, cool: true };
//   res.send('Hey! It works!');
//   res.json(peep);

//   sends back 'name=' data entered into url query
//   res.send(req.query.name);

//   sends back url query input as a json string
//   res.send(req.query) actually sends back the same thing...
//   res.json(req.query);

//   res.render('hello', {
//     name: req.query.name,
//     dog: req.query.dog,
//     title: "I love ramen"
//   });
// });

// router example of handling url inputs
// reverses name entered at '/reverse/_____'
// router.get('/reverse/:name', (req, res) => {
//   let name = [...req.params.name];
//   res.send(name.reverse().join("")) 
  
// });

module.exports = router;
