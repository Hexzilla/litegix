var mongoose = require("mongoose")

var ChannelSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "can't be blank"] },
    service: {type: String, required: [true, "can't be blank"]},
    name: {type: String, required: [true, "can't be blank"]},
    content: {type: String, required: [true, "can't be blank"]}
  },
  {
    timestamps: true,
  }
)

ChannelSchema.methods.toJSON = function(){
  return {
    id: this._id,
    service: this.service,
    name: this.name,
    content: this.content
  };
};

mongoose.model("Channel", ChannelSchema)
