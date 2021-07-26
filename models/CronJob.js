var mongoose = require('mongoose');

  var CronJobSchema = new mongoose.Schema({
      label: {type: String, required: [true, "can't be blank"]},
      username: {type: String, required: [true, "can't be blank"]},
      time:{type: String, required: [true, "can't be blank"]},
      command:{type: String, required: [true, "can't be blank"]},
      serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" }
  }, 
  {
    timestamps: true,
  }
)

mongoose.model("CronJob", CronJobSchema)

