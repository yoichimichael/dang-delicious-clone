const mongoose = require('mongoose');
// Store model schema; set in Store.js file
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  // console.log(req.name);
  
  res.render('index');
};

exports.addStore = (req, res) => {
  // used for both 'adding' and 'editing' a store to keep number of templates low and code DRY
  res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async (req, res) => {
  // store.save() returns a promise
  // ... which we 'await'
  // code will stop until save has returned data or an error
  const store = await (new Store(req.body).save());
  
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  // 'store' has a slug property from .save(), not from new Store(req.body) which only contains the form store data
  res.redirect(`/store/${store.slug}`)
};

exports.getStores = async (req, res) => {
  // Query Database for a list of all stores
  const stores = await Store.find();

  // 'stores' is name of pug template
  // { title: 'Stores' } is passed as part of locals
  res.render('stores', { title: 'Stores', stores })
};

exports.editStore = async (req, res) => {
  // 1. find the store given the id
  // await allows store to be an actual store object, not a promise
  const store = await Store.findOne({ _id: req.params.id})
  // res.json(store);
  // 2. confirm they are the owner of the store
  // 3. render out the edit form for the user can update their store
  res.render('editStore', { title: `Edit ${store.name}`, store})
}