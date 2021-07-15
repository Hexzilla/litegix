var mongoose = require('mongoose');

var TimezoneSchema = new mongoose.Schema({
  region: String,
  zones: [String],
}, {timestamps: false});

mongoose.model('Timezone', TimezoneSchema);
