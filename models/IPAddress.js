var mongoose = require('mongoose');

var IPAddressSchema = new mongoose.Schema({
  address: {type: String, required: true},
  browser: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

mongoose.model('IPAddress', IPAddressSchema);
