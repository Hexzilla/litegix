var mongoose = require('mongoose');

var ServerSchema = new mongoose.Schema({
  name: {type: String, required: [true, "can't be blank"]},
  address: {type: String, required: [true, "can't be blank"]},
  provider: String,
  webServer: String,
  database: String,
  phpVersion: String,
  connected: Boolean,
  system: {
    kernelVersion: String,
    processorName: String,
    totalCPUCore: Number,
    totalMemory: Number,
    freeMemory: Number,
    diskTotal: Number,
    diskFree: Number,
    loadAvg: Number,
    uptime: String,
  },
  sshKeys: [{
    name: {type: String, required: [true, "can't be blank"]},
    userName: {type: String, required: [true, "can't be blank"]},
    publicKey: {type: String, required: [true, "can't be blank"]},
  }],
  deploymentKeys: [{
    name: {type: String, required: [true, "can't be blank"]},
    userName: {type: String, required: [true, "can't be blank"]},
    publicKey: {type: String, required: [true, "can't be blank"]},
  }],
  supervisors: [{
    name: {type: String, required: [true, "can't be blank"]},
    userName: {type: String, required: [true, "can't be blank"]},
    numprocs: {type: Number, required: [true, "can't be blank"]},
    vendorBinary: {type: String, required: [true, "can't be blank"]},
    command: {type: String, required: [true, "can't be blank"]},
    autoStart: Boolean,
    autoRestart: Boolean,
    directory: String,
  }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  autoIndex: false
});


ServerSchema.index({ name: 1, type: -1 }); // schema level

ServerSchema.methods.toSummaryJSON = function() {
  return this.system;
};


mongoose.model('Server', ServerSchema);
