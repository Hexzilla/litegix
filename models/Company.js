var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var CompanySchema = new mongoose.Schema({
  name: {type: String, required: [true, "can't be blank"], index: true},
  address1: String,
  address2: String,
  city: String,
  postal: Number,
  state: String,
  country: String,
  tax: Number,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, 
{
  toJSON: {
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.user;
      delete ret.__v;
    }
  },
  timestamps: true
});

CompanySchema.plugin(uniqueValidator, {message: 'is already taken'});

mongoose.model('Company', CompanySchema);
