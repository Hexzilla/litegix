var mongoose = require("mongoose")

var CredittopupSchema = new mongoose.Schema(
  {
    // userId: { type: mongoose.Schema.Types.ObjectId, 
    //             ref: "User", 
    //             required: [true, "can't be blank"] },
    level: {type: Number, required: [true, "can't be blank"]},
    // name: {type: String, required: [true, "can't be blank"]},
    //description: {type: String, required: [true, "can't be blank"]},
  },
  {
    timestamps: true,
  }
)

CredittopupSchema.methods.toJSON = function(){
  return {
    id: this._id,
    level: this.level,
    //name: this.name,
    //description: this.description,
    // load: this.load,
    // memory: this.memory
  };
};

mongoose.model("Credittopup", CredittopupSchema)
