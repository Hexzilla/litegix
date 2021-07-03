var mongoose = require("mongoose")

var ServiceSchema = new mongoose.Schema(
  {
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    name: {type: String, required: [true, "can't be blank"]},
    cpuUsage: Number,
    memoryUsage: Number,
    status: {type: String, required: [true, "can't be blank"]}
  },
  {
    timestamps: false,
  }
)

mongoose.model("Service", ServiceSchema)
