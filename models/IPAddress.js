var mongoose = require("mongoose");

var IPAddressSchema = new mongoose.Schema(
  {
    address: { type: String, required: true, unique: true },
    desc: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

IPAddressSchema.methods.toJSON = function () {
  return {
    id: this._id,
    address: this.address,
    desc: this.desc,
  };
};

mongoose.model("IPAddress", IPAddressSchema);
