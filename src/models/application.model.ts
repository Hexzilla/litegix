import { Document, Schema, model } from 'mongoose'
import { Server } from './server.model'
import { SystemUser } from './systemUser.model'

export interface Application extends Document {
  name: string
  rootPath: string
  server: Server
  systemUser: SystemUser
  domainType: string
}

var ApplicationSchema = new Schema<Application>(
  {
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
    systemUser: {
      type: Schema.Types.ObjectId,
      ref: 'SystemUser',
    },
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    domainType: {
      type: String,
      required: [true, "can't be blank"],
    },
    domainName: {
      type: String,
      required: [true, "can't be blank"],
    },
    enableW3Version: {
      type: Boolean,
      required: [true, "can't be blank"],
    },
    publicPath: {
      type: String,
      required: [true, "can't be blank"],
    },
    phpVersion: {
      type: String,
      required: [true, "can't be blank"],
    },
    webAppStack: {
      // "hybrid", "nativenginx", or "customnginx"
      type: String,
      required: [true, "can't be blank"],
    },
    stackMode: {
      //"production" or "development"
      type: String,
      required: [true, "can't be blank"],
    },
    sslMode: {
      type: String,
      required: [true, "can't be blank"],
    },
    enableAutoSSL: {
      type: Boolean,
      required: [true, "can't be blank"],
    },
    /*pullKey1: {
      type: String,
      required: [true, "can't be blank"],
    },
    pullKey2: {
      type: String,
      required: [true, "can't be blank"],
    },*/
    advancedSSL: {
      advancedSSL: { type: Boolean, default: false },
      autoSSL: { type: Boolean, default: false },
    },
    settings: {
      disableFunctions: String,
      timezone: String,
      maxExecutionTime: Number,
      maxInputTime: Number,
      maxInputVars: Number,
      memoryLimit: Number,
      postMaxSize: Number,
      uploadMaxFilesize: Number,
      allowUrlFopen: Boolean,
      sessionGcMaxlifetime: Number,
      processManager: String, //"dynamic", "ondemand", or "static"
      processManagerStartServers: Number, //REQUIRED IF PROCESSMANAGER IS "DYNAMIC"
      processManagerMinSpareServers: Number, //REQUIRED IF PROCESSMANAGER IS "DYNAMIC"
      processManagerMaxSpareServers: Number, //REQUIRED IF PROCESSMANAGER IS "DYNAMIC"
      processManagerMaxChildren: Number,
      processManagerMaxRequests: Number,
      openBasedir: String,
      clickjackingProtection: Boolean,
      xssProtection: Boolean,
      mimeSniffingProtection: Boolean,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id
        delete ret.server
        delete ret.__v
      },
    },
    timestamps: false,
  }
)

export default model<Application>('Application', ApplicationSchema)
