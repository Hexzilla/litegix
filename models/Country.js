var mongoose = require('mongoose');

var CountrySchema = new mongoose.Schema({
  name: {type: String, unique: true, required: [true, "can't be blank"], index: true}
}, { timestamps: false });

mongoose.model('Country', CountrySchema);
