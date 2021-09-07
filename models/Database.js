var mongoose = require("mongoose");

var DatabaseSchema = new mongoose.Schema(
  {
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    name: { type: String, required: [true, "can't be blank"] },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "DatabaseUser" }],
    collation: String,
  },
  {
    timestamps: false,
  }
);

DatabaseSchema.methods.toJSON = function () {
  return {
    id: this._id,
    name: this.name,
    collation: this.collation,
    users: this.users.map((it) => it.toJSON()),
  };
};

mongoose.model("Database", DatabaseSchema);
