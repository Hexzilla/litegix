var mongoose = require('mongoose');

var ServerSchema = new mongoose.Schema({
  name: {type: String, required: [true, "can't be blank"]},
  address: {type: String, required: [true, "can't be blank"]},
  provider: String,
  webServer: String,
  database: String,
  php: String,
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
  applications: [{
    name: {type: String, required: [true, "can't be blank"]},
    status: String,
    owner: String,
    domain: String,
    phpVersion: String,
    stack: String,
    sslMethod: String,
  }],
  databases: [{
    name: {type: String, required: [true, "can't be blank"]},
    userName: String,
    encoding: {type: String, required: [true, "can't be blank"]}
  }],
  databaseUsers: [{
    name: String,
    password: String
  }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: false });


ServerSchema.methods.toSummaryJSON = function() {
  return this.system;
  // return  {
  //   kernelVersion: this.kernelVersion,
  //   processorName: this.processorName,
  //   totalCPUCore: this.totalCPUCore,
  //   totalMemory: this.totalMemory,
  //   freeMemory: this.freeMemory,
  //   diskTotal: this.diskTotal,
  //   diskFree: this.diskFree,
  //   loadAvg: this.loadAvg,
  //   uptime: this.uptime,
  // };
};


mongoose.model('Server', ServerSchema);

