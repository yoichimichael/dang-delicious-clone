exports.myMiddleware = (req, res, next) => {
  req.name = "Yoichi";
  if(req.name === 'Yoichi'){
    throw Error('That is a stupid name');
  }

  // sets a cookie
  // res.cookie('name', 'Yo is cool', { maxAge: 9000000000 })
  next();
}

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
}


