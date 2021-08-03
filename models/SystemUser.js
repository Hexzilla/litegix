var mongoose = require("mongoose")

var SystemUserSchema = new mongoose.Schema(
  {
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    name: {type: String, required: [true, "can't be blank"]},
    password: {type: String, required: [true, "can't be blank"]},
    deploymentKey:{type:String}
  },
  {
    timestamps: false,
  }
)

mongoose.model("SystemUser", SystemUserSchema)
