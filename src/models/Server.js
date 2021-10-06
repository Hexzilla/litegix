var mongoose = require("mongoose");
const Mail = require("nodemailer/lib/mailer");

var ServerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "can't be blank"] },
    address: { type: String, required: [true, "can't be blank"] },
    provider: String,
    webserver: String,
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
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    useremail: { type: String, required: [false, "must email formating"] },
    securityId: String,
    securityKey: String,
    SSHConfig: {
      Passwordless_Login_Only: { type: Boolean },
      Prevent_root_login: { type: Boolean },
      UseDNS: { type: Boolean },
    },
    AutoUpdate: {
      Third_Party_Software_Update: { type: Boolean },
      Security_Update: { type: Boolean },
    },
    installation: {
      status: String,
      message: String,
      progress: Number,
    },
  },
  {
    timestamps: true,
    autoIndex: false,
  }
);

ServerSchema.index({ name: 1, type: -1 }); // schema level

ServerSchema.methods.toSummaryJSON = function () {
  return this.system;
};

mongoose.model("Server", ServerSchema);
