var mongoose = require("mongoose")

var DatabaseSchema = new mongoose.Schema(
  {
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    name: { type: String, required: [true, "can't be blank"] },
    userName: String,
    encoding: { type: String, required: [true, "can't be blank"] },
  },
  {
    timestamps: false,
  }
)

mongoose.model("Database", DatabaseSchema)
