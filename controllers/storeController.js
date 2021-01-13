exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
}

exports.addStore = (req, res) => {
  // used for both 'adding' and 'editing' a store to keep number of templates low and code DRY
  res.render('editStore', { title: 'Add Store' });
};

exports.createStore = (req, res) => {
  console.log(req.body);
  res.json(req.body);
} 