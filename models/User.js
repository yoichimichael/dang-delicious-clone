const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// this apparently fixes a bug, which could now be fixed, and supresses a terminal error
mongoose.Promise = global.Promise;

const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    // always saves in database as lowercase
    lowercase: true,
    // takes off extraneous spaces
    trim: true,
    // server-side checking
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please Supply an Email Address'
  },
  name: {
    type: String,
    required: 'Please supply a name',
    trim: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date  
});

// again, using a proper function, instead of arrow function for proper 'this' binding
userSchema.virtual('gravatar').get(function(){
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

// allows login with email address
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })
// providee better errors for users
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema); 