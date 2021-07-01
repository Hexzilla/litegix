var mongoose = require('mongoose');

var ActivitySchema = new mongoose.Schema({
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
  label: {type: String, required: [true, "can't be blank"]},
  message: {type: String, required: [true, "can't be blank"]},
  date: {type: Date, required: [true, "can't be blank"]}
}, { timestamps: false });

mongoose.model('Activity', ActivitySchema);
