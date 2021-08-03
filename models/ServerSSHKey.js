var mongoose = require("mongoose")

var ServerSSHKeySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "SystemUser", required: [true, "can't be blank"] },
    label: {type: String, required: [true, "can't be blank"]},
    publicKey: {type: String, required: [true, "can't be blank"]},
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server", required: [true, "can't be blank"] }
  },
  {
    timestamps: true,
  }
)

mongoose.model("ServerSSHKey", ServerSSHKeySchema)
