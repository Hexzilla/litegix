var mongoose = require("mongoose");

var ServerActivitySchema = new mongoose.Schema(
  {
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    category: { type: Number, required: [true, "can't be blank"] },
    level: { type: Number, required: [true, "can't be blank"] },
    message: { type: String, required: [true, "can't be blank"] },
    date: { type: Date, required: [true, "can't be blank"] },
  },
  { timestamps: false }
);

ServerActivitySchema.methods.toJSON = function () {
  return {
    category: this.category,
    level: this.level,
    message: this.message,
    date: this.date,
  };
};

mongoose.model("ServerActivity", ServerActivitySchema);
