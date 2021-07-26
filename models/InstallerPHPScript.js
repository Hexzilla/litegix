var mongoose = require("mongoose")

var InstallerPHPScriptSchema = new mongoose.Schema(
  {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    name: {type: String, required: [true, "can't be blank"]},
    realName: {type: String, required: [true, "can't be blank"]},
  },
  {
    timestamps: false,
  }
)

mongoose.model("InstallerPHPScript", InstallerPHPScriptSchema)

