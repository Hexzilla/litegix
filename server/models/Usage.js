var mongoose = require("mongoose")

var UsageSchema = new mongoose.Schema(
  {
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    memory: String,
    cpu: String,
    disk: String,
    loadavg: String,
  },
  {
    timestamps: true,
  }
)

mongoose.model("Usage", UsageSchema)
