var mongoose = require("mongoose")

var ChannelSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "can't be blank"] },
    channel: {type: String, required: [true, "can't be blank"]},
    name: {type: String, required: [true, "can't be blank"]},
    //description: {type: String, required: [true, "can't be blank"]},
    load: {type: Number, required: [false, ""]},
    memory: {type: Number, required: [false, ""]}
  },
  {
    timestamps: true,
  }
)

ChannelSchema.methods.toJSON = function(){
  return {
    id: this._id,
    channel: this.channel,
    name: this.name,
    //description: this.description,
    load: this.load,
    memory: this.memory
  };
};

mongoose.model("Channel", ChannelSchema)
