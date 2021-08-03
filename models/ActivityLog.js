var mongoose = require("mongoose")

var ActivityLogSchema = new mongoose.Schema(
  {
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    label: {type: String, required: [true, "can't be blank"]},
    rootPath: {type: String, required: [true, "can't be blank"]},
    log: {type: String, required: [true, "can't be blank"]}
  },
  {
    timestamps: true,
  }
);

ActivityLogSchema.methods.toSummaryJSON = function() {
  return this.system;
};

mongoose.model("ActivityLog", ActivityLogSchema)

