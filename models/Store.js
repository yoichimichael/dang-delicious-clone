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
  photo: String
});

storeSchema.pre('save', function(next){
  if(!this.isModified('name')){
    next(); // skip if name has not been modified
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  next();
  // to do: make more resilient by making slugs unique
});

module.exports = mongoose.model('Store', storeSchema);