const mongoose = require('mongoose');
// Store model schema; set in Store.js file
const Store = mongoose.model('Store');
const User = mongoose.model('User');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid') 


// sets upload restrictions
const multerOptions = {
  // where will the file be stored
  storage: multer.memoryStorage(),
  // ES6 syntax
  fileFilter(req, file, next) {
    // get file's type
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto){
      // research more
      // this is instructions for next to pass on data and not throw an error
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed!'}, false);
    }
  }
  // what types of files will be allowed
}

exports.homePage = (req, res) => {
  // console.log(req.name);
  
  res.render('index');
};

exports.addStore = (req, res) => {
  // used for both 'adding' and 'editing' a store to keep number of templates low and code DRY
  res.render('editStore', { title: 'Add Store' });
};

// stores uploaded file to server memory, not to database
exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check id there is no new file to resize
  if(!req.file){
    next(); // skip to the next middleware
    return;
  }
  // console.log(req.file);

  // gets the filetype from mimetype
  const extension = req.file.mimetype.split('/')[1];
  //uuid generates a unique identifier string
  // extension is the filetype
  req.body.photo = `${uuid.v4()}.${extension}`;
  
  // get photo
  const photo = await jimp.read(req.file.buffer);
  // resize photo
  await photo.resize(800, jimp.AUTO);
  // save to disk
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to our filesystem, keep going! 
  next();

}

exports.createStore = async (req, res) => {
  // uses user._id to be store's author _id; creates the relationship
  req.body.author = req.user._id;

  // store.save() returns a promise
  // ... which we 'await'
  // code will stop until save has returned data or an error
  const store = await (new Store(req.body).save());
  
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  // 'store' has a slug property from .save(), not from new Store(req.body) which only contains the form store data
  res.redirect(`/store/${store.slug}`)
};

exports.getStores = async (req, res) => {
  const page = req.params.page || 1;
  const limit = 4;
  const skip = (page * limit) - limit;

  // Query Database for a list of all stores
  const storesPromise = Store
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ created: 'desc' })

  const countPromise = Store.count();

  const [stores, count] = await Promise.all([storesPromise, countPromise]);

  const pages = Math.ceil(count / limit);

  if (!stores.length && skip) {
    req.flash('info', `You asked for page ${page}, but that page doesn't exist so I put you on ${pages}`)
    res.redirect(`/stores/page/${pages}`);
    return;
  }

  // 'stores' is name of pug template
  // { title: 'Stores' } is passed as part of locals
  res.render('stores', { title: 'Stores', stores, page, pages, count })
};

const confirmOwner = (store, user) => {
  if (!store.author.equals(user._id)) {
    throw Error('You must own a store in order to edit it!');
  }
};

exports.editStore = async (req, res) => {
  // 1. find the store given the id
  // await allows store to be an actual store object, not a promise
  const store = await Store.findOne({ _id: req.params.id})
  // res.json(store);
  // 2. confirm they are the owner of the store
  confirmOwner(store, req.user);
  // 3. render out the edit form for the user can update their store
  res.render('editStore', { title: `Edit ${store.name}`, store})
}

exports.updateStore = async (req, res) => {
  // set the location data to be a point
  // fixes a bug where updating a store's address does not assign a location.type
  req.body.location.type = 'Point';
  // find and update the store
  const store = await Store.findOneAndUpdate(
    { _id: req.params.id }, 
    req.body, 
    { 
      new: true, // return the new store instead of the old one
      runValidators: true // runs the validators we set in our model schema on this data, too
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store →</a>`);
  // redirect them to the store and tell them it worked
    res.redirect(`/stores/${store._id}/edit`);
}

exports.getStoreBySlug = async (req, res, next) => {
  // res.send('it works!');
  // res.json(req.params);
  const store = await Store.findOne({ slug: req.params.slug }).populate('author reviews');

  // if not store is returned, go to next function in middleware
  if(!store) return next();
  // res.json(store);
  res.render('store', { store, title: store.name });
}

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;

  // if a there is no tag, send a query for records that have a tag property on it (which is all of them)
  const tagQuery = tag || { $exists: true};

  // promise gets our tag list
  const tagsPromise = Store.getTagsList();
  // finds all the stores that include the specific tag
  const storesPromise = Store.find({ tags: tagQuery });

  // ES6 destructuring
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);

  
  res.render('tag', { tags, title: 'Tags', tag, stores });
}

exports.searchStores = async (req, res) => {
  const stores = await Store
  // first find stores that match
  .find({
    $text: {
      $search: req.query.q     
    }
  }, {
    score: { $meta: 'textScore' }
  })
  // then sort them
  .sort({
    score: { $meta: 'textScore' }
  })
  // limit to only 5 results
  .limit(5);
  res.json(stores);
}

exports.mapStores = async (req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat); //make sure to turn string to nums
  const q = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        $maxDistance: 10000 // 10km
      }
    }
  };

  const stores = await Store.find(q).select('slug name description location photo').limit(10);
  res.json(stores);
}

exports.mapPage = (req, res) => {
  res.render('map', { title: 'Map' });
}

exports.heartStore = async (req, res) => {
  // toString() is a MongoDB method (see: polymorphism)
  const hearts = req.user.hearts.map(obj => obj.toString())
  const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet'; 
  const user = await User
    .findByIdAndUpdate(
      req.user._id,
      { [operator]: { hearts: req.params.id } },
      { new: true }
    );
  res.json(user);
}

exports.getHearts = async (req, res) => {
  const stores = await Store.find({
    _id: { $in: req.user.hearts }
  });
  res.render('stores', { title: 'Hearted Stores', stores });
};  

exports.getTopStores = async (req, res) => {
  const stores = await Store.getTopStores();
  res.render('topStores', { stores, title: '★ Top Stores!'});
}