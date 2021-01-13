const mongoose = require('mongoose');
// Store model schema; set in Store.js file
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
}

exports.addStore = (req, res) => {
  // used for both 'adding' and 'editing' a store to keep number of templates low and code DRY
  res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  // store.save() returns a promise
  // ... which we 'await'
  // code will stop until save has returned data or an error
  await store.save()
  res.redirect('/')
} 