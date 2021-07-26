var mongoose = require("mongoose")

var ApplicationSchema = new mongoose.Schema(
  {
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    server_user_id : { type: Number, required: [true, "can't be blank"]},
    name: {type: String, required: [true, "can't be blank"]},
    rootPath: {type: String, required: [true, "can't be blank"]},
    publicPath: String,
    phpVersion: {type: String, required: [true, "can't be blank"]},
    stack: {type: String, required: [true, "can't be blank"]}, // "hybrid", "nativenginx", or "customnginx"
    stackMode: {type: String, required: [true, "can't be blank"]}, //"production" or "development"
    type: {type: String, required: [true, "can't be blank"]},
    defaultApp: {type: Boolean, default: false},
    alias: String,
    pullKey1: {type: String, required: [true, "can't be blank"]},
    pullKey2: {type: String, required: [true, "can't be blank"]},
    advancedSSL: {
      advancedSSL: {type: Boolean, default: false},
      autoSSL: {type: Boolean, default: false}
    },
    settings:{
      disableFunctions:String, 
      timezone: String,
      maxExecutionTime:Number,
      maxInputTime:Number,
      maxInputVars:Number,
      memoryLimit:Number,
      postMaxSize:Number,
      uploadMaxFilesize:Number,
      allowUrlFopen:Boolean,
      sessionGcMaxlifetime:Number,
      processManager: String, //"dynamic", "ondemand", or "static"
      processManagerStartServers:Number,//REQUIRED IF PROCESSMANAGER IS "DYNAMIC"
      processManagerMinSpareServers:Number,//REQUIRED IF PROCESSMANAGER IS "DYNAMIC"
      processManagerMaxSpareServers:Number,//REQUIRED IF PROCESSMANAGER IS "DYNAMIC"
      processManagerMaxChildren:Number,
      processManagerMaxRequests:Number,
      openBasedir:String,
      clickjackingProtection: Boolean, 
      xssProtection: Boolean,
      mimeSniffingProtection: Boolean,
    }
  },
  {
    timestamps: false,
  }
)

mongoose.model("Application", ApplicationSchema)

