const mongoose = require('mongoose');

// setting mongoose.Promise to the native Promise
mongoose.Promise = global.Promise;

const slug = require('slugs');
const { stringify } = require('uuid');

// 
const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    // takes out whitespace on either side of input string
    trim: true,
    // you can set this to 'true', which would generate a MongoDB error, or you can customize your own error message, which will only show if a name isn't entered
    required: 'Please enter a store name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  // specifies an array of strings
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!'
    }],
    address: {
      type: String,
      required: 'You must supply an address!'
    }
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    // tells MongoDB to check the User table
    ref: 'User',
    required: 'You must supply an author'
  }
}, {
  // specifies that virtual fields should be present in JSON and Object imports
  toJSON: { virtuals: true },
  toObject: { virtuals: true},
});

// define our indexes
storeSchema.index({
  name: 'text',
  description: 'text'
});

// for geolocation indexing
storeSchema.index({ location: '2dsphere' });

storeSchema.pre('save', async function(next){
  if(!this.isModified('name')){
    next(); // skip if name has not been modified
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  // find other stores that have a slug of wes, wes-1, wes-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  //this.constructor == Store
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if(storesWithSlug.length){
    // if there are stores returned with the regex, this will dynamically add a number to the end
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`
  }


  next();
  // to do: make more resilient by making slugs unique
});

// need to use a proper function here so that 'this' inside the function will be bound to the model
// don't use an arrow function
storeSchema.statics.getTagsList = function(){
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } }},
    { $sort: { count: -1 } }
  ]);
}

// aggregate is MongoDB-specific so we can't use the reviews virtual
storeSchema.statics.getTopStores = function(){
  return this.aggregate([
    // Lookup Stores and populate their reviews
    { $lookup: { 
      from: 'reviews', 
      localField: '_id', 
      foreignField: 'store', 
      // this is how the reviews property will be labeled in returned JSON
      // can be anything
      as: 'reviews' 
    }},
    // filter for only items that have 2 or more reviews
    // the .1 is how to reference things that are indexed
    { $match: {
      'reviews.1': { $exists: true }
    }},
    // Add the average reviews field
    // with $project, need to add back all the fields
    { $project: {
      photo: '$$ROOT.photo',
      name: '$$ROOT.name',
      reviews: '$$ROOT.reviews',
      slug: '$$ROOT.slug',
      averageRating: { $avg: '$reviews.rating' }
    } },
    // sort it by our new field, highest reviews first
    // averageRating gets 1 or -1; -1 is highest to lowest
    { $sort: { averageRating: -1 } },
    // limit to at most 10
    { $limit: 10 }
  ]);
}

// find reviews where the stores _id property === reviews store property
// note this is Mongoose-specific
storeSchema.virtual('reviews', {
  ref: 'Review', // what model to link?
  // store
  localField: '_id', // which field on the store?
  // Review instance's store field
  foreignField: 'store' // which field on the review?
});

function autopopulate(next) {
  this.populate('reviews');
  next();
}

storeSchema.pre('find', autopopulate);
storeSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Store', storeSchema);