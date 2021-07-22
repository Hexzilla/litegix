var mongoose = require("mongoose")

var BackupplanSchema = new mongoose.Schema(
  {
    // userId: { type: mongoose.Schema.Types.ObjectId, 
    //             ref: "User", 
    //             required: [true, "can't be blank"] },
    index: {type: Number, required: [true, "can't be blank"]},
    packagename: {type: String, required: [true, "can't be blank"]},
    price: {type: Number, required: [true, "can't be blank"]},
  },
  {
    timestamps: true,
  }
)

BackupplanSchema.methods.toJSON = function(){
  return {
    id: this._id,
    index: this.index,
    packagename: this.packagename,
    price: this.price,
  };
};

mongoose.model("Backupplan", BackupplanSchema)
