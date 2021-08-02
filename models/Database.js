var mongoose = require("mongoose")

var DatabaseSchema = new mongoose.Schema(
  {
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    name: { type: String, required: [true, "can't be blank"] },
    users: [
      { type:mongoose.Schema.Types.ObjectId, ref:"DatabaseUser"}
    ],
    collation: String,
  },
  {
    timestamps: false,
  }
)

mongoose.model("Database", DatabaseSchema)
