var mongoose = require("mongoose")

var DomainsSchema = new mongoose.Schema(
  {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    name: {type: String, required: [true, "can't be blank"]},
    type: {type: String, required: [true, "can't be blank"]},
    www: {type:Boolean, default:true},
    redirection: String,
    wildcard: {type:Boolean, default:false},
    dns_integration: String,
    status: String
  },
  {
    timestamps: false,
  }
)

mongoose.model("Domains", DomainsSchema)

