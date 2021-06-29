var mongoose = require('mongoose');

var WebApplicationSchema = new mongoose.Schema({
  name: {type: String, required: [true, "can't be blank"]},
  status: String,
  owner: String,
  domain: String,
  phpVersion: String,
  stack: String,
  sslMethod: String,
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' }
}, { timestamps: false });


mongoose.model('WebApplication', WebApplicationSchema);

