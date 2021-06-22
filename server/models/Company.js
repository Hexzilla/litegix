var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var CompanySchema = new mongoose.Schema({
  name: {type: String, unique: true, required: [true, "can't be blank"], index: true},
  address1: {type: String},
  address2: {type: String},
  city: {type: String},
  postalCode: {type: Number},
  states: {type: String},
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  tax: {type: Number},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true});

CompanySchema.plugin(uniqueValidator, {message: 'is already taken'});

CompanySchema.methods.toJSON = function(){
  return {
    
  };
};

mongoose.model('Company', CompanySchema);
