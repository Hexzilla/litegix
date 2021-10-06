var mongoose = require("mongoose");

var DatabaseUserSchema = new mongoose.Schema(
  {
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    name: { type: String, required: [true, "can't be blank"] },
    password: { type: String, required: [true, "can't be blank"] },
  },
  {
    timestamps: false,
  }
);

DatabaseUserSchema.methods.toJSON = function () {
  return {
    id: this._id,
    name: this.name,
  };
};

mongoose.model("DatabaseUser", DatabaseUserSchema);
