var mongoose = require("mongoose")

var ApplicationSchema = new mongoose.Schema(
  {
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    name: {type: String, required: [true, "can't be blank"]},
    status: String,
    owner: String,
    domain: String,
    phpVersion: String,
    stack: String,
    sslMethod: String,
  },
  {
    timestamps: false,
  }
)

mongoose.model("Application", ApplicationSchema)
