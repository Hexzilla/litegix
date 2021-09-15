var mongoose = require("mongoose");

var SupervisorSchema = new mongoose.Schema(
  {
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    name: { type: String, required: [true, "can't be blank"] },
    userName: { type: String, required: [true, "can't be blank"] },
    numprocs: { type: Number, required: [true, "can't be blank"] },
    vendorBinary: { type: String, required: [true, "can't be blank"] },
    command: { type: String, required: [true, "can't be blank"] },
    autoStart: Boolean,
    autoRestart: Boolean,
    directory: String,
  },
  {
    timestamps: true,
  }
);

SupervisorSchema.methods.toJSON = function () {
  return {
    id: this._id,
    name: this.name,
    userName: this.userName,
    numprocs: this.numprocs,
    vendorBinary: this.vendorBinary,
    command: this.command,
    autoStart: this.autoStart,
    autoRestart: this.autoRestart,
    directory: this.directory,
  };
};

mongoose.model("Supervisor", SupervisorSchema);
