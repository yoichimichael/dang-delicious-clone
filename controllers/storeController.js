const mongoose = require('mongoose');
// Store model schema; set in Store.js file
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  // console.log(req.name);
  
  res.render('index');
}

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
} 

exports.getStores = async (req, res) => {
  // 1. Query Database for a list of all stores
  const stores = await Store.find();
  console.log(stores);
  // 'stores' is name of pug template
  // { title: 'Stores' } is passed as part of locals
  res.render('stores', { title: 'Stores', stores })
}