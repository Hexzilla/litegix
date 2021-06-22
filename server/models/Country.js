var mongoose = require('mongoose');

var CountrySchema = new mongoose.Schema({
  name: {type: String, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true}
}, {timestamps: false});

mongoose.model('Country', CountrySchema);
