var mongoose = require("mongoose")

var DatabaseUserSchema = new mongoose.Schema(
  {
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    name: {type: String, required: [true, "can't be blank"]},
    password: {type: String, required: [true, "can't be blank"]}
  },
  {
    timestamps: false,
  }
)

mongoose.model("DatabaseUser", DatabaseUserSchema)
