var mongoose = require("mongoose")

var AdvancedSSLSchema = new mongoose.Schema(
  {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    domainId: { type: mongoose.Schema.Types.ObjectId, ref: "Domains" },

    method: {type: String, required: [true, "can't be blank"]},
    enableHttp: {type: Boolean, required: [true, "can't be blank"]},
    enableHsts: {type: Boolean, required: [true, "can't be blank"]},
    ssl_protocol_id: Number,
    
    staging: {type: Boolean, default: false},
    api_id: Number,
    validUntil: Date,
    renewalDate: Date,

    authorizationMethod:String,
    externalApi:Number,
    environment:String,

    privateKey: String,
    certificate: String,

    csrKeyType:String,
    organization: String,
    department: String,
    city:String,
    state:String,
    country: String,
  },
  {
    timestamps: false,
  }
)

mongoose.model("AdvancedSSL", AdvancedSSLSchema)

