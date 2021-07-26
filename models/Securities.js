var mongoose = require('mongoose');

var SecuritiesSchema = new mongoose.Schema({
  sec_type: {type: String, required: true},
  port: { type: Number, required: true },
  protocol: {type: String, required: true},
  ip_address: {type: String, required: true},
  action: {type: String, required: true},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  server_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' }

}, {timestamps: true});

mongoose.model('Securities', SecuritiesSchema);