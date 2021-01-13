exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
}

exports.addStore = (req, res) => {
  res.send("It works");
}
