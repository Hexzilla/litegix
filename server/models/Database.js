var mongoose = require('mongoose');

var DatabaseSchema = new mongoose.Schema({
  name: {type: String, required: [true, "can't be blank"]},
  assignUser: String,
  collectionName: String,
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' }
}, { timestamps: false });


mongoose.model('Database', DatabaseSchema);

