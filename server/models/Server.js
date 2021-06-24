var mongoose = require('mongoose');

var ServerSchema = new mongoose.Schema({
  name: {type: String, required: [true, "can't be blank"]},
  address: {type: String, required: [true, "can't be blank"]},
  provider: String,
  webServer: String,
  database: String,
  php: String,
  connected: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: false });

mongoose.model('Server', ServerSchema);
