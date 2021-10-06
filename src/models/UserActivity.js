var mongoose = require("mongoose");

var UserActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: { type: Number, required: [true, "can't be blank"] },
    level: { type: Number, required: [true, "can't be blank"] },
    message: { type: String, required: [true, "can't be blank"] },
    date: { type: Date, required: [true, "can't be blank"] },
  },
  { timestamps: false }
);

UserActivitySchema.methods.toJSON = function () {
  return {
    category: this.category,
    level: this.level,
    message: this.message,
    date: this.date,
  };
};

mongoose.model("UserActivity", UserActivitySchema);
