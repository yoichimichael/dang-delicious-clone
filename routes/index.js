const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  const peep = { name: "YO", age: 200, cool: true };
  // res.send('Hey! It works!');
  // res.json(peep);

  //sends back 'name=' data entered into url query
  // res.send(req.query.name);

  //sends back url query input as a json string
  //res.send(req.query) actually sends back the same thing...
  // res.json(req.query);

  res.render('hello', {
    name: req.query.name,
    dog: req.query.dog,
    title: "I love ramen"
  });
});

// router example of handling url inputs
// reverses name entered at '/reverse/_____'
router.get('/reverse/:name', (req, res) => {
  let name = [...req.params.name];
  res.send(name.reverse().join("")) 
  
});

module.exports = router;
